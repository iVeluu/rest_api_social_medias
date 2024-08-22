import mongoosePagination from 'mongoose-pagination'
import fs from 'fs'
import path from "path";


import User from "../models/User.js"
import { hashPassword, checkPassword } from "../utils/auth.js";
import { generateJWT } from "../utils/jwt.js";
import { followThisUser } from '../utils/follow.js';

export class UserController {
  static createAccount = async (req, res) => {
    const { password, email } = req.body;

    try {
      //Prevenir duplicados
      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error("El Usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      //Crear un usuario
      const user = new User(req.body);

      //hashpassword
      user.password = await hashPassword(password);

      await user.save();
      res.send("Usuario Creado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req, res) => {
    const { password, email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("Usuario no Encontrado");
        return res.status(404).json({ error: error.message });
      }

      //Revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        //Mostramos el error
        const error = new Error("Password Incorrecto");
        return res.status(401).json({ error: error.message });
      }

      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static profileInfo = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuario No Encontrado" });
      }

      const followInfo = await followThisUser(req.user.id, userId)

      res.json({
        user,
        following: followInfo.following,
        follower: followInfo.follower
      });
    } catch (error) {
      res.status(500).json({ error: "Error del Servidor" });
    }
  };

  static list = async (req, res) => {
    const page = req.params.page ? req.params.page : 1;
    const itemsPerPage = 5;
    const count = await User.countDocuments({});

    try {
      // Calcular el número de documentos a saltar
      const skip = (page - 1) * itemsPerPage;

      // Realizar la consulta con paginación
      const users = await User.find()
        .sort("_id")
        .skip(skip)
        .limit(itemsPerPage);

      res.json({ users, pagesMax: Math.ceil(count / itemsPerPage) });
    } catch (error) {
      res.status(500).json({ error: "Error del Servidor" });
    }
  };

  static updateInfo = async (req, res) => {
    const { name, surname, bio, nick, email } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    // Validación del nick
    const userExistByNick = await User.findOne({ nick });
    if (
      userExistByNick &&
      userExistByNick.id.toString() !== req.user.id.toString()
    ) {
      const error = new Error("Ese nick ya está registrado");
      return res.status(409).json({ error: error.message });
    }

    req.user.name = name;
    req.user.surname = surname;
    req.user.bio = bio;
    req.user.nick = nick;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Usuario Actualizado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error del Servidor" });
    }
  };

  static upload = async (req, res) => {
    //Revisar que el fichero de imagen y comprobar si existe
    if (!req.file) {
      return res.status(404).json({ error: "Peticion no incluye la imagen" });
    }

    //get the image name
    const image = req.file.originalname;

    //get the extension
    const ext = image.split(".")[1];

    if (
      ext !== "png" &&
      ext !== "jpg" &&
      ext !== "jpeg" &&
      ext !== "avif" &&
      ext !== "webp"
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: "Invalid format" });
    }

    if (req.user.image && req.user.image !== "default.png") {
      //Conseguir la ruta a eliminar
      const fullPath = path.join(process.cwd(), "public/avatas", req.user.image);
  
      // Verificar si el archivo existe
      fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(404).json({ message: "Imagen no encontrada" });
        }
        // Eliminar el archivo
        fs.unlink(fullPath, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Hubo un Error" });
          }
        });
      });
    }

    //Asignar la nueva imagen
    req.user.image = req.file.filename;

    try {
      await req.user.save();
      res.send("Imagen Actualizada con Exito")
    } catch (error) {
      res.status(500).json({ error: "Error del Servidor" });
    }
  };

  static avatar = async ( req, res ) => {
    //Sacar el parametro de la url
    const { file } = req.params;

    //Montar el path real de la imagen
    const fullPath = path.join(process.cwd(), "public/avatas", file);

    //Comprobar que existe
    // Verificar si el archivo existe
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Imagen no encontrada" });
      }

      //Devolver el file
      return res.sendFile(path.resolve(fullPath))
    });
  }

  static test = async (req, res) => {
    res.json({ user: req.user });
  };

}
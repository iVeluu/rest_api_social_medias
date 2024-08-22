import User from "../models/User.js";
import Follow from "../models/Follow.js";
import { followUserId } from "../utils/follow.js";

export class FollowController {
  static follow = async (req, res) => {
    //Obtener la persona a la que seguiras
    const { followed } = req.body

    //Generar el follow
    const follow = new Follow({
        user: req.user.id,
        followed,
    })

    try {
        await follow.save()
        res.send("Follow!")
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error'})
    }
  };

  static unfollow = async (req, res) => {
    //Obtener la persona a la que seguiras
    const { unfollowedId } = req.params;

    //Generar el follow
    const unfollow = await Follow.findOne({
      user: req.user.id,
      followed: unfollowedId,
    });

    if(!unfollow){
        return res.status(404).json({error: 'Hubo un Error!'})
    }

    try {
        await unfollow.deleteOne();
        res.send("Unfollow!")
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error'})
    }
  };

    static following = async (req, res) => {
      //Obtener el id del usuario autenticado
      const userId  = req.user.id

      //Actualizar el valor del id si obtenemos un valor de la url
      if(req.params.userId) userId = req.params.userId
      //Obtenemos el valor del page 
      const page = req.params.page ? req.params.page : 1
      //items per page
      const itemsPerPage = 5
      try {
        const totalCount = await Follow.countDocuments({ user: userId });
        const skip = (page - 1) * itemsPerPage;
  
        const usuarios = await Follow.find({ user: userId })
          .populate("user followed", "-password -role -__v")
          .skip(skip)
          .limit(itemsPerPage);

        const followUserIds = await followUserId(req.user.id)
  
         res.json({
           usuarios,
           user_follows: followUserIds.followingClean,
           user_followers: followUserIds.followersClean,
           totalPages: Math.ceil(totalCount / itemsPerPage),
         });
      } catch (error) {
        
      }

    }


    static followers = async (req, res) => {

    }

}

import { Router } from 'express'
import { body, param } from "express-validator";
import { UserController } from '../controllers/UserController.js';
import { authenticate } from '../middleware/auth.js';
import { handleInputErrors } from '../middleware/validation.js';
import multer from 'multer';

const router = Router()

//Configuracion de subida de archivos 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/avatas/")
  },
  filename: ( req, file, cb ) => {
    cb(null, "avatar-" + Date.now() +"-"+file.originalname)
  }
})

const uploads = multer({storage})

router.post('/', 
    UserController.createAccount
)


router.post('/login', 
    UserController.login
)

router.get(
  "/profile/:userId",
  param("userId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  authenticate,
  UserController.profileInfo
);

router.get(
  "/list/:page?",
  authenticate,
  UserController.list
);

router.post('/update-profile', 
    authenticate,
    UserController.updateInfo
)

router.post('/upload', 
    authenticate,
    uploads.single("file0"),
    UserController.upload
)

router.get('/avatar/:file', 
    authenticate,
    UserController.avatar
)



router.get("/test-midd", authenticate, UserController.test);

export default router
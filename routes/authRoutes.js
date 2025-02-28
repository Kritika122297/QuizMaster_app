import express from 'express';
import { loginController, registerController, logoutController } from '../controller/authcontroller.js';

const router = express.Router()


//routes 
router.post('/register', registerController)

// LOGIN || POST
router.post('/login', loginController);
router.post('/logout', logoutController);


//export 
export default router
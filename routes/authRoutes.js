import express from 'express';
import { loginController, registerController } from '../controller/authcontroller.js';

//router object
const router = express.Router()


//routes 
router.post('/register', registerController)

// LOGIN || POST
router.post('/login', loginController);

//export 
export default router;
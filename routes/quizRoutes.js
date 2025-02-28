import express from 'express';
import { 
    createQuiz, 
    updateQuiz, 
    deleteQuiz, 
    getAllQuizzes, 
    getQuizzesByUser, 
    getQuizById, 
    getAllPublicQuizzes, 
    attemptQuestion, 
    attempQuiz, 
    reviewAttempts 
} from '../controller/quizcontroller.js';
import { userAuth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/create', userAuth, createQuiz);
router.put('/:id', userAuth, updateQuiz);
router.delete('/:id', userAuth, deleteQuiz);
router.get('/all', getAllQuizzes);
router.get('/public', getAllPublicQuizzes);
router.get('/user', userAuth, getQuizzesByUser);
router.get('/:quizId', getQuizById);


router.post('/:quizId/question/:questionId', userAuth, attemptQuestion);
router.post('/:quizId/attempt', userAuth, attempQuiz);
router.get('/review/:userId', userAuth, reviewAttempts);

export default router;

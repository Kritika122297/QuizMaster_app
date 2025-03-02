import express from 'express';
import { 
    submitScore, 
    getTopScores, 
    getUserBestScore, 
    getLeaderboard, 
    resetLeaderboard 
} from '../controller/leaderboardcontroller.js';
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post('/:quizId/submit', userAuth, submitScore);       
router.get('/:quizId/top', getTopScores);                           
router.get('/:quizId/user/:username', getUserBestScore);            
router.get('/:quizId?', getLeaderboard);                            
router.delete('/:quizId/reset', userAuth, resetLeaderboard); 

export default router;

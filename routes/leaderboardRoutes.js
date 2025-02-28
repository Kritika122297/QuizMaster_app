import express from 'express';
import { 
    submitScore, 
    getTopScores, 
    getUserBestScore, 
    getLeaderboard, 
    resetLeaderboard 
} from '../controllers/leaderboardController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/:quizId/submit', authenticateUser, submitScore);       
router.get('/:quizId/top', getTopScores);                           
router.get('/:quizId/user/:username', getUserBestScore);            
router.get('/:quizId?', getLeaderboard);                            
router.delete('/:quizId/reset', authenticateUser, resetLeaderboard); 

export default router;

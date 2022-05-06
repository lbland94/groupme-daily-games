import { Router } from 'express';
import { gameRouter } from './game/game.router';
import { scoreboardRouter } from './scoreboard/scoreboard.router';

const router: Router = Router();

router.use('/game', gameRouter);
router.use('/scoreboard', scoreboardRouter);

export default router;

import { validateRequestBody } from '@/middleware/validator';
import { CreateGameRequest } from '@/types/requests/game/CreateGameRequest';
import { Router } from 'express';
import Controller from './game.controller';

export const gameRouter: Router = Router();
export const gameController = new Controller();

// Sign In
gameRouter.post('', validateRequestBody(CreateGameRequest), gameController.create);

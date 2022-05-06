import { errorHandler } from '@/helpers/errorHandler';
import { Request, Response } from 'express';
import Game from '@/apiV1/game/game.model';
import { CreateGameRequest } from '@/types/requests/game/CreateGameRequest';

export default class GameController {
  public async create(req: Request<any, any, CreateGameRequest>, res: Response) {
    try {
      const createGameRequest = req.body;
      const newGame = new Game(createGameRequest);

      await newGame.save();
    } catch (e) {
      errorHandler.internalServerError(e, req, res);
    }
  }
}

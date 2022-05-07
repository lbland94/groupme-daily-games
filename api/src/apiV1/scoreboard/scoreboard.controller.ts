import { errorHandler } from '@/helpers/errorHandler';
import { GamesService } from '@/services/games';
import { GroupmeService } from '@/services/groupme';
import { FetchScoreboardRequest } from '@/types/requests/scoreboard/FetchScoreboardRequest';
import dayjs, { DEF_TZ } from '@/utilities/dayjs';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default class ScoreboardController {
  public async getDay(req: Request<any, any, any, FetchScoreboardRequest['query']>, res: Response) {
    try {
      let date = dayjs().tz(DEF_TZ);
      if (req.query.date) {
        date = dayjs(req.query.date, 'YYYY-MM-DD').tz(DEF_TZ);
      }

      const minMax = GamesService.minMaxResetTime(date.format('YYYY-MM-DD'));
      const messages = await GroupmeService.fetchRange(minMax.startTime, minMax.endTime);
      const scores = GamesService.parseGames(
        messages.map((m) => ({ msg: m.text, user: m.user.name, timestamp: m.createdAt })),
        date.format('YYYY-MM-DD'),
      );
      res.status(httpStatus.OK).json(scores);
    } catch (e) {
      errorHandler.internalServerError(e, req, res);
    }
  }
}

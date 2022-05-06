import dayjs from '@/utilities/dayjs';
import { GAMES } from './games.const';
import { Score } from './games.interface';

function applyTypes<T extends Record<string, (...args: any[]) => any>>(match: RegExpExecArray, types: T) {
  const typedOutput: Partial<Record<keyof T, ReturnType<T[keyof T]> | string>> = {};
  for (const key in match.groups || {}) {
    try {
      typedOutput[key as keyof T] = types[key as keyof T](match.groups[key]);
    } catch (e) {
      typedOutput[key as keyof T] = match.groups[key];
    }
  }
  return typedOutput;
}

export class GamesService {
  public static parseGames(inputs: Array<{ user: string; msg: string; timestamp: number }>, date?: string) {
    const day = date ? dayjs(date, 'YYYY-MM-DD') : dayjs().startOf('day');
    const scores: Score[] = [];
    const gameMinMax = this.allMinMax(day);
    for (const input of inputs) {
      for (const game of GAMES) {
        const index = GAMES.indexOf(game);
        const min = gameMinMax[index]?.min;
        const max = gameMinMax[index]?.max;
        if (game.regex.test(input.msg)) {
          const match = game.regex.exec(input.msg);
          if (min && max) {
            if (min.unix() > input.timestamp || max.unix() < input.timestamp) continue;
          }
          scores.push({
            game: game.name,
            info: applyTypes(match, game.regexTypes),
            source: input.msg,
            user: input.user,
            timestamp: input.timestamp,
          });
        }
      }
    }

    return scores;
  }

  public static minMaxResetTime(date: string) {
    let min = GAMES[0].utcResetOffset;
    let max = min;
    GAMES.forEach((g) => {
      if (g.utcResetOffset < min) {
        min = g.utcResetOffset;
      }
      if (g.utcResetOffset > max) {
        max = g.utcResetOffset;
      }
    });
    const day = dayjs.utc(date, 'YYYY-MM-DD');
    const endTime = day.clone().add(max, 'minutes').add(1, 'day');
    const startTime = day.clone().add(min, 'minutes');

    return { startTime, endTime };
  }

  public static allMinMax(date: dayjs.Dayjs) {
    return GAMES.map((g) => {
      const utcDate = date.isUTC() ? date.clone() : date.clone().add(date.utcOffset(), 'minutes');
      return {
        min: utcDate.clone().subtract(g.utcResetOffset, 'minutes'),
        max: utcDate.clone().subtract(g.utcResetOffset, 'minutes').add(1, 'days'),
      };
    });
  }
}

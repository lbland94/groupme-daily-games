import { ApiSubModule } from '@/api/modules/base/ApiSubModule';
import { Score } from './scoreboardApi.interfaces';

export class ScoreboardApi extends ApiSubModule {
  public fetchScoreboard(date?: string, forceRefresh?: boolean) {
    return this.get<Score[]>('', { params: { date, forceRefresh } });
  }
}

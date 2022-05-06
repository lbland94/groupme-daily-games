import { ApiModule } from '@/api/modules/base/ApiModule';
import { ScoreboardApi } from '@/api/modules/scoreboard/scoreboardApi';

export class Api extends ApiModule {
  public scoreboard: ScoreboardApi;
  public constructor(baseUrl: string) {
    super(baseUrl, '');
    this.scoreboard = new ScoreboardApi(this.axiosInstance, '/scoreboard');
  }
}

export const api = new Api(process.env.VUE_APP_API_URL);

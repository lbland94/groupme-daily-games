import config from '@/config/config';
import { Client, Group } from 'node-groupme';
import dayjs from '@/utilities/dayjs';

export class GroupmeService {
  public static client: Client;
  public static group: Group;
  public static initialized?: Promise<boolean>;

  public static async initialize() {
    let resolve: (value: boolean) => void;
    this.initialized = new Promise((res, rej) => {
      resolve = res;
    });
    try {
      this.client = new Client(config.GROUPME_ACCESS_TOKEN);

      await this.client.login();
      const groups = await this.client.groups.fetch();
      this.group = groups.find((g) => g.name === config.GROUPME_GROUP_NAME);
      resolve(true);
    } catch (e) {
      console.error(e);
      resolve(false);
    } finally {
      await this.close();
    }
  }

  public static async fetchRange(startTime: dayjs.Dayjs, endTime: dayjs.Dayjs) {
    try {
      if (!(await this.initialized)) {
        await this.initialize();
      }
      const limit = 50;
      const messages = (await this.group.messages.fetch({ limit })).array();
      while (messages[0]?.createdAt > startTime.unix()) {
        messages.unshift(...(await this.group.messages.fetch({ limit, before_id: messages[0].id })).array());
      }
      return messages.filter((m) => m.createdAt > startTime.unix() && m.createdAt < endTime.unix());
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async close() {
    try {
      this.client.ws.close();
      await this.client.logout();
    } catch (e) {
      console.error(e);
    }
  }
}

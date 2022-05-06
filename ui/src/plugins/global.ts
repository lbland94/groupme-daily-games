import { App } from 'vue';
import mqViewports from '@/plugins/mqViewports';

export default (app: App<Element>) => {
  mqViewports.install(app);
};

import app from './App';
import CONFIG from '@/config/config';
import { GroupmeService } from '@/services/groupme';
// import './config/db';

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

GroupmeService.initialize().then(() => {
  console.log('ready');
});

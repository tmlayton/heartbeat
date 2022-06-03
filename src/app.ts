import express from 'express';
import { ping, log } from './utils';

const app = express();

scheduleJobs();

function scheduleJobs() {
  setInterval(() => {
    ping();
  }, 10000);
}

app.listen(6969, () => {
  log('Server started at port 6969');
});

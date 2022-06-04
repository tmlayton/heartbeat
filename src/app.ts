import express from 'express';
import { ping, log } from './utils';
import { pingIntervalMs, port } from '../config.json';

const app = express();

scheduleJobs();

function scheduleJobs() {
  setInterval(() => {
    ping();
  }, Number(pingIntervalMs));
}

app.listen(port, () => {
  log(`Server started at port ${port}`);
});

import Vonage from '@vonage/server-sdk';
import { apiKey, apiSecret, from, to } from '../data.json';
import tcpp from 'tcp-ping';

const vonage = new Vonage({ apiKey, apiSecret });
let offline = false;

export function ping() {
  log('Pinging...');
  tcpp.ping({ address: '192.168.1.86', attempts: 1 }, function (_, data) {
    const error = data.results[0].err;
    if (error != null) {
      if (Object.keys(error).length === 0 || (error as any).code === 'EHOSTDOWN' || (error as any).code === 'EHOSTUNREACH') {
        offlineHandler();
      } else if ((error as any).code === 'ECONNREFUSED') {
        onlineHandler();
      }
    } else {
      offlineHandler();
    }
  });
}

function offlineHandler() {
  log('Offline.');
  if (offline) return;
  offline = true;
  sendText('⚠️ Heads-Up: The garage fridge has lost power.');
}

function onlineHandler() {
  offline = false;
  log('Online.');
}

function sendText(text: string) {
  vonage.message.sendSms(from, to, text, {}, (err, responseData) => {
    if (err) {
      log(err);
    } else {
      if (responseData.messages[0]['status'] === '0') {
        log('Message sent successfully.');
      } else {
        log(
          `Message failed with error: ${responseData.messages[0]['error-text']}`
        );
      }
    }
  });
}

export function log(message: any) {
  const localTime = new Date().toLocaleString();
  console.log(`[${localTime}] ${message}`);
}

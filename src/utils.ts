import tcpp from 'tcp-ping';
import nodemailer from 'nodemailer';
import { appPass } from '../data.json';

let offline = false;

export function ping() {
  log('Pinging...');
  tcpp.ping({ address: '192.168.1.86', attempts: 1 }, function (_, data) {
    const error = data.results[0].err;
    if (error != null) {
      if (
        Object.keys(error).length === 0 ||
        (error as any).code === 'EHOSTDOWN' ||
        (error as any).code === 'EHOSTUNREACH'
      ) {
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
  sendEmail();
}

function onlineHandler() {
  offline = false;
  log('Online.');
}

function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'laytontm@gmail.com',
      pass: appPass,
    },
  });

  const mailOptions = {
    from: 'laytontm@gmail.com',
    to: 'laytontm@gmail.com',
    subject: '⚠️ Heads-Up: The garage fridge has lost power.',
    text: 'The Raspberry Pi appears to be offline. Please check the garage fridge.',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export function log(message: any) {
  const localTime = new Date().toLocaleString();
  console.log(`[${localTime}] ${message}`);
}

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
  if (offline === true) return;
  offline = true;
  sendEmail(
    '⚠️ Heads-Up: The garage fridge has lost power.',
    'The Raspberry Pi appears to be offline. Please check the garage fridge.'
  );
}

function onlineHandler() {
  log('Online.');
  if (offline === false) return;
  offline = false;
  sendEmail(
    '✅ Power restored: The garage fridge has power.',
    'The Raspberry Pi is back online. The garage fridge is working fine.'
  );
}

function sendEmail(subject: string, text: string) {
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
    subject,
    text,
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

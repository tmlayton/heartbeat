import tcpp from 'tcp-ping';
import nodemailer from 'nodemailer';
import {
  applicationSpecificPassword,
  pingAddress,
  gmailAddress,
  offlineSubject,
  offlineBody,
  onlineSubject,
  onlineBody,
} from '../config.json';

let offline = false;

export function ping() {
  log('Pinging...');
  tcpp.ping({ address: pingAddress, attempts: 1 }, function (_, data) {
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
  sendEmail(offlineSubject, offlineBody);
}

function onlineHandler() {
  log('Online.');
  if (offline === false) return;
  offline = false;
  sendEmail(onlineSubject, onlineBody);
}

function sendEmail(subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailAddress,
      pass: applicationSpecificPassword,
    },
  });

  const mailOptions = {
    from: gmailAddress,
    to: gmailAddress,
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

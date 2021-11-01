const fs = require('fs/promises');
const getIP = require('external-ip')();
const nodemailer = require('nodemailer');
const env = require('dotenv').config().parsed;
const DATA_FILE_NAME = env.DATA_FILE_NAME || 'data.json'

main();

async function main() {
  let nowMs = Date.now();
  let nowStr = Date().toString();
  let data = await readData() || {};

  let transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  })

  getIP(async (err, ip) => {
    if (err) {
      console.error("ERROR of IP", err.message || err);
      throw err;
    }

    const newData = {};
    newData.lastCheckMs = nowMs;
    newData.lastCheckStr = nowStr;
    newData.ip = ip;

    await saveData(newData);

    if (ip !== data.ip) {
      transporter.sendMail({
        from: '"Node js" <aevgrafov@craftus.com>',
        to: 'alexander.evgrafov@gmail.com',
        subject: 'NodeJS fixes changes',
        // text: ` ${ip}`,
        html:
          `JT at ${ip}  (${ nowStr })`,
      }).then(result => {

        console.log('Mail result: ', result)
      }).catch(err => {
        console.error('ERROR', err);
      });
    } else {
      console.log('Same IP', ip);
    }
  });
}

function readData(){
  return fs.readFile(DATA_FILE_NAME).then(text=>JSON.parse(text)).catch(err=>{
    console.error("Data file read error", err.message || err);
  })
}

function saveData(json) {
  return fs.writeFile(DATA_FILE_NAME, JSON.stringify(json, null, 4));
}

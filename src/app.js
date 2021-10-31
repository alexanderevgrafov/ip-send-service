const getIP = require('external-ip')();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: ,
  port: 587,
  secure: false,
  auth: {
    user: ,
    pass: ,
  },
})

getIP((err, ip) => {
  if (err) {
    throw err;
  }
  console.log('IP: ', ip);
  transporter.sendMail({
    from: '"Node js" <aevgrafov@craftus.com>',
    to: 'aevgrafov@craftus.com, alexander.evgrafov@gmail.com',
    subject: 'Message from Node js',
    text: `This message was sent from Node js server at ${ip}`,
    html:
      `This <i>message</i> was sent from <strong>Node js</strong> server at  ${ip}`,
  }).then(result => {

    console.log('Mail result: ', result)
  })
});

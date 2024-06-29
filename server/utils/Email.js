require("dotenv").config();
const nodemailer = require("nodemailer");

// ! Inicializando o sender
const sender = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PWD,
  },
});

/**
 * Envia um email para um determinado destinatário com determinado assunto e texto.
 * @param {String} to Email do destinatário.
 * @param {String} subject Assunto do email.
 * @param {String} text Texto do email.
 * @returns {Boolean} Retorna true se o email foi enviado, e false caso contrário.
 *
 * **/
const sendEmail = async (to, subject, text) => {
  try {
    await sender.sendMail({
      from: process.env.EMAIL_LOGIN,
      to: to,
      subject: subject,
      html: text,
    });
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { sendEmail };

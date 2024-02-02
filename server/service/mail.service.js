const nodemailer = require("nodemailer");
const getMailProvider = require("../utils/getMailProvider");
const ApiError = require("../exceptions/api-error");

const isGoogleMail =
  !!process.env.SMTP_GOOGLE_PASSWORD &&
  !!process.env.SMTP_GOOGLE_USER &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_GOOGLE_HOST;

const isYandexMail =
  !!process.env.SMTP_YANDEX_PASSWORD &&
  !!process.env.SMTP_YANDEX_USER &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_YANDEX_HOST;

class MailService {
  constructor() {
    this.yandexTransporter = nodemailer.createTransport({
      service: "Yandex",
      host: process.env.SMTP_YANDEX_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_YANDEX_USER,
        pass: process.env.SMTP_YANDEX_PASSWORD,
      },
    });

    this.gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_GOOGLE_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_GOOGLE_USER,
        pass: process.env.SMTP_GOOGLE_PASSWORD,
      },
    });
  }

  async sendActivationLinkToGmail({ to, link }) {
    try {
      isGoogleMail
        ? await this.gmailTransporter.sendMail({
            from: process.env.SMTP_GOOGLE_USER,
            to,
            subject: "Подтверждение аккаунта Yo!",
            text: "",
            html: `<div>
                 <h1>Нажмите на кнопку для активации</h1>
                 <a href='${link}'>Подтвердить</a>
              </div>`,
          })
        : ApiError.ModuleOutOfWork();
    } catch (e) {
      throw e;
    }
  }

  async sendActivationLinkToYandex({ to, link }) {
    try {
      isYandexMail
        ? await this.yandexTransporter.sendMail({
            from: process.env.SMTP_YANDEX_USER,
            to,
            subject: "Подтверждение аккаунта Yo!",
            text: "",
            html: `<div>
                 <h1>Нажмите на кнопку для активации</h1>
                 <a href='${link}'>Подтвердить</a>
              </div>`,
          })
        : ApiError.ModuleOutOfWork();
    } catch (e) {
      throw e;
    }
  }

  async sendActivationLink({ to, link }) {
    const emailProvider = getMailProvider(to);
    const sendFields = {
      to,
      link,
    };

    if (emailProvider) {
      switch (emailProvider) {
        case "gmail":
          return await this.sendActivationLinkToGmail(sendFields);

        case "yandex":
          return await this.sendActivationLinkToYandex(sendFields);

        default:
          return await this.sendActivationLinkToGmail(sendFields);
      }
    }
  }
}

module.exports = new MailService();

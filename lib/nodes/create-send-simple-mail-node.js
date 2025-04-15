import { __name } from '../chunk-SHUYVCID.js';
import nodemailer from 'nodemailer';
import { createNode } from '../lib/create-node.ts';

const createSendSimpleMailNode = /* @__PURE__ */ __name(({
  name,
  smtpConfig,
  mailOptions
}) => {
  const transporter = nodemailer.createTransport(smtpConfig);
  const process = /* @__PURE__ */ __name(async ({ msg, log }) => {
    const messageType = msg.email?.messageType || mailOptions?.messageType || "text";
    const message = msg.email?.message || msg.payload || mailOptions?.message;
    const mo = {
      from: msg.email?.from || mailOptions?.from,
      to: msg.email?.to || mailOptions?.to,
      cc: msg.email?.cc || mailOptions?.cc,
      bcc: msg.email?.bcc || mailOptions?.bcc,
      subject: msg.email?.subject || "No Subject",
      text: messageType === "text" ? message : void 0,
      html: messageType === "html" ? message : void 0
      //   attachments: msg.email?.attachments || undefined,
      //   priority: msg.email?.priority || "normal",
    };
    try {
      const info = await transporter.sendMail(mo);
      log.info(`Email sent: ${info.messageId}`);
      msg.payload = {
        messageId: info.messageId,
        envelope: info.envelope,
        accepted: info.accepted,
        rejected: info.rejected,
        pending: info.pending,
        response: info.response
      };
      return msg;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }, "process");
  return createNode({ type: "sendMailNode", name, process });
}, "createSendSimpleMailNode");

export { createSendSimpleMailNode };

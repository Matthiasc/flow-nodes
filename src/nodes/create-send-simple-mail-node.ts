import nodemailer from "nodemailer";
import { createNode, type ProcessFn } from "../lib/create-node.ts";

type MailOptions = {
  from?: string;
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  //   text?: string;
  //   html?: string;
  //   attachments?: any[];
  messageType?: "text" | "html";
  message?: string;
  //   replyTo?: string;
};

export const createSendSimpleMailNode = ({
  name,
  smtpConfig,
  mailOptions,
}: {
  name: string;
  smtpConfig: any;
  mailOptions?: MailOptions;
}) => {
  const transporter = nodemailer.createTransport(smtpConfig);

  const process: ProcessFn = async ({ msg, log }) => {
    // if (!msg.email || !msg.email.to) {
    //   throw new Error("Missing email recipient (to). Unable to send email.");
    // }

    const messageType =
      msg.email?.messageType || mailOptions?.messageType || "text";

    const message = msg.email?.message || msg.payload || mailOptions?.message;

    const mo = {
      from: msg.email?.from || mailOptions?.from,
      to: msg.email?.to || mailOptions?.to,
      cc: msg.email?.cc || mailOptions?.cc,
      bcc: msg.email?.bcc || mailOptions?.bcc,
      subject: msg.email?.subject || "No Subject",
      text: messageType === "text" ? message : undefined,
      html: messageType === "html" ? message : undefined,
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
        response: info.response,
      };
      return msg;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  };

  return createNode({ type: "sendMailNode", name, process });
};

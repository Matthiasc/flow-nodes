import { N as Node, M as Msg, L as Logger } from '../create-node-4Dq8xNOT.js';

type MailOptions = {
    from?: string;
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject?: string;
    messageType?: "text" | "html";
    message?: string;
};
declare const createSendSimpleMailNode: ({ name, smtpConfig, mailOptions, }: {
    name: string;
    smtpConfig: any;
    mailOptions?: MailOptions;
}) => {
    name: string;
    type: string;
    to: (node: Node) => any;
    children: () => any[];
    nodeTree: () => {
        node: Node;
        children?: Node[];
    }[];
    process: ({ msg, globals, }: {
        msg: Msg;
        globals?: any;
    }) => Promise<void>;
    log: Logger;
};

export { createSendSimpleMailNode };

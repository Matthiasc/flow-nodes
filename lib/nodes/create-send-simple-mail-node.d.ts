import { Logger } from '../lib/create-logger.js';
import { Node, Msg } from '../lib/create-node.js';
import '../lib/create-globals.js';

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

import { NodeCreationFn } from '../lib/create-node.js';
import '../lib/create-globals.js';
import '../lib/create-logger.js';

type MailOptions = {
    from?: string;
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject?: string;
    messageType?: "text" | "html";
    message?: string;
};
interface SendSimpleMailNodeProps {
    smtpConfig: any;
    mailOptions?: MailOptions;
}
declare const createSendSimpleMailNode: NodeCreationFn<SendSimpleMailNodeProps>;

export { createSendSimpleMailNode };

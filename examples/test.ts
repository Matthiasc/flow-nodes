import { createCronNode, createReadFileNode, createSendSimpleMailNode, createTemplateNode, deserializeFlow, serializeFlow } from "../src";

import { config } from "dotenv";
config();

// const mailNode = createSendSimpleMailNode("mailNode1", {
//     smtpConfig: {
//         service: "gmail",
//         auth: {
//             user: "{{GOOGLE_ACCOUNT_USERNAME}}",
//             pass: "{{GOOGLE_APP_PASSWORD}}"
//         }
//     },
//     mailOptions: {
//         from: "matthias.crommelinck+test@gmail.com",
//         to: "matthias.crommelinck@gmail.com",
//         subject: "Test Email",
//         message: "This is a test email."
//     }
// });

// const cronNode = createCronNode("cronNode1", {
//     cronTime: "*/5 * * * * *" // Every 10 seconds
// });

// const readFileNode = createReadFileNode("readFileNode1", {
//     filePath: "./test.txt"
// });

// const templateNode = createTemplateNode("templateNode1", {
//     template: `<h1>Test Email</h1>
//                <p>Current Time: <%= new Date().toLocaleString() %></p>
//                <p>File Content: <%= msg.fileContent %></p>`
// });



// cronNode.to(readFileNode).to(mailNode);

// cronNode.stop();


// console.log(JSON.stringify(serializeFlow([cronNode, readFileNode, mailNode]), null, 2));

const nodesConfiguration = `{
  "nodes": [
    {
      "name": "cronNode1",
      "type": "cronNode",
      "properties": {
        "cronTime": "*/5 * * * * *"
      },
      "connections": [
        "readFileNode1"
      ]
    },
    {
      "name": "readFileNode1",
      "type": "readFileNode",
      "properties": {
        "filePath": "./test.txt",
        "encoding": "utf-8"
      },
      "connections": [
        "mailNode1"
      ]
    },
    {
      "name": "mailNode1",
      "type": "sendMailNode",
      "properties": {
        "smtpConfig": {
          "service": "gmail",
          "auth": {
            "user": "{{GOOGLE_ACCOUNT_USERNAME}}",
            "pass": "{{GOOGLE_APP_PASSWORD}}"
          }
        },
        "mailOptions": {
          "from": "matthias.crommelinck+test@gmail.com",
          "to": "matthias.crommelinck@gmail.com",
          "subject": "Test Email",
          "message": "This is a test email."
        }
      },
      "connections": []
    }
  ],
  "startNodes": [
    "cronNode1"
  ]
}`


const res = deserializeFlow(JSON.parse(nodesConfiguration))



res.startFlow();
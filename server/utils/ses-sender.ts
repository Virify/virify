// server/email/sesSender.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { useRuntimeConfig } from "#imports";

export async function sesSender(html: string, subject: string, to: string) {
  try {
    const config = useRuntimeConfig();

    const client = new SESClient({
      region: "eu-west-2",
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: "Virify <no-reply@virify.co.uk>",
    };

    const command = new SendEmailCommand(params);
    await client.send(command);
  } catch (error) {
    throw error;
  }
}

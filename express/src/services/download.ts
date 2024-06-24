import { Request, Response } from "express-serve-static-core";
import {
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client as s3Client } from "./client";

export async function getObjectDownloadUrl(
  req: Request<{}, {}, {}, GetObjectCommandInput>,
  res: Response
) {
  const query = req.query;

  try {
    const command = new GetObjectCommand(query);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 5, // seconds
    });

    res.status(200).send({ success: true, signedUrl });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

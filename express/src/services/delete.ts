import { Request, Response } from "express-serve-static-core";
import { DeleteObjectCommand, DeleteObjectRequest } from "@aws-sdk/client-s3";
import { client as s3Client } from "./client";

export async function deleteObjectByKey(
  req: Request<{}, {}, {}, DeleteObjectRequest>,
  res: Response
) {
  const query = req.query;

  const { Bucket, Key } = query;

  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key,
    });

    const response = await s3Client.send(command);

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

import { Request, Response } from "express-serve-static-core";
import {
  ListBucketsCommand,
  Bucket,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";
import { client as s3Client } from "./client";

export async function getBuckets(
  req: Request,
  res: Response<Bucket[] | undefined>
) {
  try {
    const data = await s3Client.send(new ListBucketsCommand());
    const buckets = data.Buckets;

    res.send(buckets);
  } catch (error) {
    console.log(error);
    res.send(undefined);
  }
}

export async function getBucketObjectByKey(
  req: Request<{}, {}, {}, GetObjectCommandInput>,
  res: Response
) {
  const { Key, Bucket } = req.query;
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  console.log(command);

  try {
    const response = await s3Client.send(command);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send("error");
  }
}

export async function getBucketObjectsList(
  req: Request<{}, {}, {}, ListObjectsV2CommandInput>,
  res: Response
) {
  // Note: We can filter bucket objects by Prefix, StartAfter, check ListObjectsV2CommandInput
  const { Bucket, StartAfter, Prefix } = req.query;

  const command = new ListObjectsV2Command({
    Bucket,
    // The default and maximum number of keys returned is 1000. This limits it to
    MaxKeys: 1000,
    // StartAfter: "user-4",
    // Prefix: "user",
  });

  try {
    console.log("Your bucket contains the following objects:\n");
    const response = await s3Client.send(command);
    res.send({ response });
  } catch (err) {
    res.send(err);
  }
}

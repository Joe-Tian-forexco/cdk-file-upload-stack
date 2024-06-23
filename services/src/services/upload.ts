import { Request, Response } from "express-serve-static-core";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  Bucket,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteParams, UploadParams } from "../types/type";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "ap-southeast-2",
});

export async function getUploadSignedUrl(req: Request<{}, {}, {}, UploadParams>, res: Response) {
  const bucketName = `${process.env.AWS_BUCKET_NAME!}-${process.env.APP_ENVIRONMENT!}`;
  const query = req.query;

  const { userId, category, fileName, extension } = query;

  const objectKey = `${userId}/${category}/${fileName}.${extension}`;

  try {
    // TODO: check if request is authenticated by PTX

    // TODO: check file type, size, and other validations
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey, // Note: optimise the file path for better organised s3 storage
      Metadata: {
        userId,
        category,
      },
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60, // seconds
    });

    res.status(200).send({ success: true, signedUrl });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

export async function getBucketObjects(req: Request, res: Response) {
  try {
    const bucketName = `${process.env.AWS_BUCKET_NAME!}-${process.env.APP_ENVIRONMENT!}`;
    const command = new ListObjectsCommand({ Bucket: bucketName });
    const data = await s3Client.send(command);

    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(undefined);
  }
}

export async function getBuckets(req: Request, res: Response<Bucket[] | undefined>) {
  try {
    // const sessionChecking = req.session;
    // const passportUserChecking = req.user;
    // console.log("passportUserChecking", passportUserChecking);
    // console.log("sessionChecking", sessionChecking);

    const data = await s3Client.send(new ListBucketsCommand());
    const buckets = data.Buckets;

    res.send(buckets);
  } catch (error) {
    console.log(error);
    res.send(undefined);
  }
}

export async function getDownloadSignedUrl(url: string) {
  try {
    await fetch(url, {
      method: "PUT",
      body: "Hello from PTX!",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getUsersTest(req: Request, res: Response) {
  try {
    res.send(["dfdf"]);
  } catch (error) {
    console.log(error);
  }
}

export async function getSuperTest(req: Request, res: Response) {
  try {
    res.send([]);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBucketObject(req: Request<{}, {}, {}, DeleteParams>, res: Response) {
  const bucketName = `${process.env.AWS_BUCKET_NAME!}-${process.env.APP_ENVIRONMENT!}`;
  const query = req.query;

  const { userId, category, fileName, extension } = query;
  const objectKey = `${userId}/${category}/${fileName}.${extension}`;

  const bucketParams = { Bucket: bucketName, Key: objectKey };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
}

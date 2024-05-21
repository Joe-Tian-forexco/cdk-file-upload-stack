import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class FileUploadStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    console.log("Creating S3 bucket", process.env.AWS_S3_BUCKET_NAME);
    const clientBucket = new s3.Bucket(this, "PTX-FileUploadBucket", {
      bucketName: 'ptx-file-upload-bucket-test-one',
      versioned: true,
      publicReadAccess: false,
    });

    console.log("Creating S3 bucket", clientBucket);
  }
}

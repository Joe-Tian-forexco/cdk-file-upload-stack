import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class FileUploadStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const clientBucket = new s3.Bucket(this, "PTX-FileUploadBucket", {
      bucketName: "ptx-file-upload-bucket-test",
    });

    console.log("Creating S3 bucket", clientBucket);
  }
}

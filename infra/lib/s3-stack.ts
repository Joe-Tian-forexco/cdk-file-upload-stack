import { Stack, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { AppStackProps } from "./config";

export class S3Stack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { config } = props;
    const environment = config.APP_ENVIRONMENT;

    const s3LogicalId = `ptx-files-s3-cloudformation-${environment}`;
    const s3BucketName = `ptx-files-${environment}`;

    // Create an S3 bucket to store PTX files
    const ptxFilesBucket = new Bucket(this, s3LogicalId, {
      bucketName: s3BucketName,
      versioned: true,
      publicReadAccess: false, // TODO: How to access the file with url in the future?
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

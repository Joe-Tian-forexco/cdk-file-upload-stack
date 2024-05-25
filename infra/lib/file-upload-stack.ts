import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ConfigProps } from "./config";

type ApplicationStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>;
};

export class FileUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const { config } = props;

    console.log("Current Environment----->", config);
    const isProduction = config.APP_ENVIRONMENT === "production";
    const s3LogicalId = isProduction ? "PTX-Files-Bucket-Production" : "PTX-Files-Bucket-Staging";
    const s3BucketName = isProduction ? "ptx-files-production" : "ptx-files-staging";

    const ptxFilesBucket = new s3.Bucket(this, s3LogicalId, {
      bucketName: s3BucketName,
      versioned: true,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

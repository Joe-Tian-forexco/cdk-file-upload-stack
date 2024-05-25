import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ConfigProps } from "./config";
import * as iam from "aws-cdk-lib/aws-iam";

type ApplicationStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>;
};

export class FileUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const { config } = props;
    const isProduction = config.APP_ENVIRONMENT === "production";
    const environment = config.APP_ENVIRONMENT;

    const s3LogicalId = `ptx-files-s3-cloudformation-${environment}`;
    const s3BucketName = `ptx-files-${environment}`;
    const roleLogicalId = 'ptx-files-s3-role-cloudformation'
    const roleName = 'ptx-files-s3-role'

    // Create an S3 bucket to store PTX files
    const ptxFilesBucket = new s3.Bucket(this, s3LogicalId, {
      bucketName: s3BucketName,
      versioned: true,
      publicReadAccess: isProduction ? false : true, // TODO: How to access the file with url in the future?
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create an IAM role for the Lambda function
    const lambdaRole = new iam.Role(this, roleLogicalId, {
      roleName: roleName,
      description: "Role for the Lambda function to get presigned URL",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonS3FullAccess"
        ),
      ],
    });
  }
}

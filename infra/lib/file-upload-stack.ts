import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ConfigProps } from "./config";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import path = require("path");

type ApplicationStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>;
};

export class FileUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const { config } = props;
    const isProduction = config.APP_ENVIRONMENT === "production";
    console.log("Is Production Environment----->", isProduction);
    const environment = config.APP_ENVIRONMENT;
    const appLambdaName = config.LAMBDA_NAME;

    const s3LogicalId = `ptx-files-s3-cloudformation-${environment}`;
    const s3BucketName = `ptx-files-${environment}`;
    const roleLogicalId = "ptx-files-s3-role-cloudformation";
    const roleName = "ptx-files-s3-role";
    const lambdaLogicalId = `${appLambdaName}-cloudformation-${environment}`;
    const lambdaName = `${appLambdaName}-${environment}`;

    // Create an S3 bucket to store PTX files
    const ptxFilesBucket = new s3.Bucket(this, s3LogicalId, {
      bucketName: s3BucketName,
      versioned: true,
      publicReadAccess: false, // TODO: How to access the file with url in the future?
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create an IAM role for the Lambda function
    const lambdaRole = new iam.Role(this, roleLogicalId, {
      roleName: roleName,
      description: "Role for the Lambda function to get presigned URL",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));

    // Create lambda function to get presigned URL
    const fileUploadLambda = new lambda.Function(this, lambdaLogicalId, {
      functionName: lambdaName,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../services')),
      role: lambdaRole,
    });

    // Create API Gateway to trigger the lambda function
  }
}

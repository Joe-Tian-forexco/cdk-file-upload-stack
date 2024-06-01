import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Role, ServicePrincipal, ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { AppStackProps } from "../config";

interface ApiStackProps extends AppStackProps {
  getPresignedUrlLambda: LambdaIntegration;
}

export class LambdaStack extends Stack {
  public readonly getPresignedUrlLambda: LambdaIntegration;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { config } = props;
    const isProduction = config.APP_ENVIRONMENT === "production";
    console.log("Is Production Environment----->", isProduction);
    const environment = config.APP_ENVIRONMENT;
    const appLambdaName = config.LAMBDA_NAME;

    const roleLogicalId = "ptx-files-s3-role-cloudformation";
    const roleName = "ptx-files-s3-role";
    const lambdaLogicalId = `${appLambdaName}-cloudformation-${environment}`;
    const lambdaName = `${appLambdaName}-${environment}`;

    // Create an IAM role for the Lambda function
    const lambdaRole = new Role(this, roleLogicalId, {
      roleName: roleName,
      description: "Role for the Lambda function to get presigned URL",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));

    // Create lambda function to get presigned URL
    const fileUploadLambda = new lambda.Function(this, lambdaLogicalId, {
      functionName: lambdaName,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "upload.handler",
      code: lambda.Code.fromAsset(join(__dirname, "../services", "upload")),
      role: lambdaRole,
    });

    this.getPresignedUrlLambda = new LambdaIntegration(fileUploadLambda);
  }
}

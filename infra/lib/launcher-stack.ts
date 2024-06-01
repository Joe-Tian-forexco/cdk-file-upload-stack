import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStackProps } from "./config";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { LambdaRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export class LauncherStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { config } = props;
    const environment = config.APP_ENVIRONMENT;
    const appLambdaName = config.LAMBDA_NAME;

    const lambdaLogicalId = `${appLambdaName}-cloudformation-${environment}`;
    const lambdaName = `${appLambdaName}-${environment}`;

    const apiLogicalId = `ptx-files-api-${environment}`;
    const apiName = `ptx-files-api-${environment}`;

    // Create an S3 bucket to store PTX files
    const ptxFilesBucket = new Bucket(this, `ptx-files-s3-${environment}`, {
      bucketName: `ptx-files-${environment}`,
      versioned: true,
      publicReadAccess: false, // TODO: check later
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create an IAM role for the Lambda function
    const lambdaRole = new Role(this, `ptx-files-role-${environment}`, {
      roleName: `ptx-files-role-${environment}`,
      description: "Role for the Lambda function to get presigned URL",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));

    // Create lambda function to get presigned URL
    const fileUploadLambda = new Function(this, lambdaLogicalId, {
      functionName: lambdaName,
      runtime: Runtime.NODEJS_18_X,
      handler: "upload.handler",
      code: Code.fromAsset(join(__dirname, "../../services")),
      role: lambdaRole,
    });

    // Create API Gateway
    const api = new LambdaRestApi(this, apiLogicalId, {
      handler: fileUploadLambda,
      restApiName: apiName,
      description: "API Gateway for PTX files",
      deploy: true,
      proxy: false,
    });

    api.root.addResource("upload").addMethod("GET");
  }
}

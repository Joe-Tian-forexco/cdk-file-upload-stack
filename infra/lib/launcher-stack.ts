import { RemovalPolicy, Stack, aws_apigateway } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStackProps } from "./config";
import { Bucket, BucketProps, HttpMethods } from "aws-cdk-lib/aws-s3";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
// import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";

export class LauncherStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { config } = props;
    const { APP_ENVIRONMENT, LAMBDA_NAME, AWS_BUCKET_NAME } = config;

    const lambdaLogicalId = `${LAMBDA_NAME}-cloudformation-${APP_ENVIRONMENT}`;
    const lambdaName = `${LAMBDA_NAME}-${APP_ENVIRONMENT}`;

    const bucketName = `${AWS_BUCKET_NAME}-${APP_ENVIRONMENT}`;

    const apiLogicalId = `ptx-files-api-${APP_ENVIRONMENT}`;
    const apiName = `ptx-files-api-${APP_ENVIRONMENT}`;

    // Create an S3 bucket to store PTX files
    const bucketOptions: BucketProps = {
      bucketName: bucketName,
      versioned: true,
      publicReadAccess: false, // TODO: check later
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // TODO: be careful with this
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.HEAD],
          allowedOrigins: ["*"], // Note: add 'https://ptxmarkets.com' in the future
          allowedHeaders: ["*"],
          exposedHeaders: [],
        },
      ],
    };

    const ptxFilesBucket = new Bucket(this, `ptx-files-s3-${APP_ENVIRONMENT}`, bucketOptions);

    // Create an IAM role for the Lambda function
    const lambdaRole = new Role(this, `ptx-files-role-${APP_ENVIRONMENT}`, {
      roleName: `ptx-files-role-${APP_ENVIRONMENT}`,
      description: "Role for the Lambda function to get presigned URL",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"));

    // Create lambda function to get presigned URL
    const uploadLambda = new Function(this, lambdaLogicalId, {
      functionName: lambdaName,
      runtime: Runtime.NODEJS_18_X,
      handler: "dist/lambda.handler",
      code: Code.fromAsset(join(__dirname, "../../express/zip/Archive.zip")),
      role: lambdaRole,
      memorySize: 128,
      environment: config,
      // environment: {
      //   BUCKET_NAME: bucketName,
      // },
      // initialPolicy: [],
    });

    const uploadLambdaIntegration = new HttpLambdaIntegration("fileUploadIntegration", uploadLambda);

    // Create API Gateway
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2_integrations-readme.html

    // const httpApi = new HttpApi(this, apiName);
    // httpApi.addRoutes({
    //   path: "/",
    //   methods: [HttpMethod.GET],
    //   integration: uploadLambdaIntegration,
    // });

    // Create API Gateway
    const ApiGw = new aws_apigateway.LambdaRestApi(
      this,
      apiLogicalId,
      {
        handler: uploadLambda,
        restApiName: apiName,
        deploy: true,
        proxy: true,
        binaryMediaTypes: ["*/*"],
      }
    );
  }
}

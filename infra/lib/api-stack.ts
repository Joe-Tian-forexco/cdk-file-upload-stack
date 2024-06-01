import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStackProps } from "./config";

interface ApiStackProps extends AppStackProps {
  getPresignedUrlLambda: LambdaIntegration;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { config } = props;
    const environment = config.APP_ENVIRONMENT;
    const apiLogicalId = `ptx-files-api-cloudformation-${environment}`;
    const apiName = `ptx-files-api-${environment}`;

    const api = new RestApi(this, apiLogicalId,{
        restApiName: apiName,
        description: "API Gateway for PTX files",
    });
    
    api.root.addResource("s3-presigned-url").addMethod("GET", props.getPresignedUrlLambda);
  }
}

import { StackProps } from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

export interface AppStackProps extends StackProps {
  config: Readonly<ConfigProps>;
}

// Joe-Note: This helps with managing the env variables in the CDK stack.
export type ConfigProps = {
  REGION: string;
  APP_ENVIRONMENT: string;
  LAMBDA_NAME: string;
  AWS_BUCKET_REGION: string;
  AWS_BUCKET_NAME: string;
};

export const getConfig = (): ConfigProps => {
  return {
    REGION: process.env.REGION || "ap-southeast-2",
    APP_ENVIRONMENT: process.env.APP_ENVIRONMENT || "staging",
    LAMBDA_NAME: process.env.LAMBDA_NAME || "staging",
    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION || "ap-southeast-2",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "ptx-files",
  };
};

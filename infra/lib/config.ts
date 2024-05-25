import * as dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export type ConfigProps = {
  REGION: string;
  APP_ENVIRONMENT: string;
  AWS_S3_BUCKET_NAME: string;
  LAMBDA_NAME: string;
};

export const getConfig = (): ConfigProps => {
  return {
    REGION: process.env.REGION || "ap-southeast-2",
    APP_ENVIRONMENT: process.env.APP_ENVIRONMENT || "staging",
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "ptx-files",
    LAMBDA_NAME: process.env.LAMBDA_NAME || "staging",
  };
};

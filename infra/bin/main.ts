import * as cdk from "aws-cdk-lib";
import { FileUploadStack } from "../lib/file-upload-stack";
import { getConfig } from "../lib/config";

const config = getConfig();
const app = new cdk.App();

new FileUploadStack(app, "PTX-S3-Uploader", {
  env: {
    region: config.REGION,
  },
  config,
});

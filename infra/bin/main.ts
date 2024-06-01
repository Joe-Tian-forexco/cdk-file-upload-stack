import { App } from "aws-cdk-lib";
import { getConfig } from "../lib/config";
import { S3Stack } from "../lib/s3-stack";

const config = getConfig();
const app = new App();

const environment = config.APP_ENVIRONMENT;

new S3Stack(app, `PTX-S3-Bucket-${environment}`, {
  config,
});

// new FileUploadStack(app, `PTX-S3-Uploader-${environment}`, {
//   env: {
//     region: config.REGION,
//   },
//   config,
// });

app.synth();

import { App } from "aws-cdk-lib";
import { getConfig } from "../lib/config";
import { LauncherStack } from "../lib/launcher-stack";

const config = getConfig();
const app = new App();

const environment = config.APP_ENVIRONMENT;

new LauncherStack(app, `PTX-Uploader-Stack-${environment}`, {
  env: {
    region: config.REGION,
  },
  config,
});

app.synth();

import serverlessExpress from "@codegenie/serverless-express";
import { Context, Handler } from "aws-lambda";
import express from "express";
import router from "./routes/routes";


let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {

    const expressApp = express();
    expressApp.use("/api", router);

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
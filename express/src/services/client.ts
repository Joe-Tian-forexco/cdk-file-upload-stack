// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { S3Client } from "@aws-sdk/client-s3";
// This relies on a Region being set up in your local AWS config.
const client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "ap-southeast-2",
});
export { client };


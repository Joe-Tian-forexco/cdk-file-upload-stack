import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamodbDemoTable = new dynamodb.Table(this, "ddbDemoTable-zt-logical-id", {
      readCapacity: 5,
      writeCapacity: 2,
      partitionKey: { name: "customerId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Note: This will delete the table and all its data. Use with caution!
      tableName: "ddb-demo-table-zt",
    });
  }
}

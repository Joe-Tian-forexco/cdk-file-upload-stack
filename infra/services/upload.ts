// Note: It seems like we need to build ts file to js file before we can deploy the stack.
// cd infra
// npm run build
export const handler = async (event: unknown) => {
  // TODO implement
  console.log("event----->", event);
  return "Hello from zt-cdk Lambda!";
};

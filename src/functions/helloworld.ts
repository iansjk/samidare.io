/* eslint-disable import/prefer-default-export */
import { APIGatewayEvent, Context } from "aws-lambda";

interface Response {
  statusCode: number;
  body: string;
}

export async function handler(event: APIGatewayEvent, context: Context) {
  console.log("a");
  console.log("a");
  console.log("a");
  console.log("a");
  return {
    statusCode: 200,
    body: "Hello, world",
  };
}

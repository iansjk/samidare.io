/* eslint-disable import/prefer-default-export */
import { APIGatewayEvent } from "aws-lambda";
import faunadb, { query as q } from "faunadb";

const client = new faunadb.Client({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  secret: process.env.FAUNADB_SECRET!,
  scheme: "https",
});

interface FaunaDbResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface Response {
  statusCode: number;
  body: string;
}

export async function handler(event: APIGatewayEvent): Promise<Response> {
  const slug = event?.queryStringParameters?.slug;
  if (!slug) {
    return {
      statusCode: 400,
      body: "No slug specified",
    };
  }
  try {
    const response: FaunaDbResponse = await client.query(
      q.Get(q.Match(q.Index("planner_slug"), slug))
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (e) {
    if (e.name === "NotFound") {
      return {
        statusCode: 404,
        body: e.message,
      };
    }
    return {
      statusCode: 500,
      body: e.message || e,
    };
  }
}

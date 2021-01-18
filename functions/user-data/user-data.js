// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query, Client } = require("faunadb");

if (!process.env.FAUNADB_SECRET) {
  throw new Error("FAUNADB_SECRET environment variable not set");
}

const client = new Client({
  secret: process.env.FAUNADB_SECRET,
  scheme: "https",
});

const handler = async (event, context) => {
  let userId = "";
  if (process.env.CONTEXT === "dev") {
    console.log("uh oh why is process.env.CONTEXT === dev");
    userId = event.queryStringParameters.userId;
  } else {
    console.log(JSON.stringify(context.clientContext));
    userId =
      context.clientContext && context.clientContext.user
        ? context.clientContext.user.sub
        : "";
  }
  if (!userId) {
    return {
      statusCode: 403,
      body: "You are not logged in.",
    };
  }
  try {
    if (event.httpMethod === "GET") {
      const response = await client.query(
        query.Get(query.Match(query.Index("userdata_by_userId"), userId))
      );
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    }
    if (event.httpMethod === "POST") {
      await client.query(
        query.Update(
          query.Select(
            ["ref"],
            query.Get(query.Match(query.Index("userdata_by_userId"), userId))
          ),
          { data: { ...JSON.parse(event.body) } }
        )
      );
      return {
        statusCode: 200,
        body: "Update successful",
      };
    }
    return {
      statusCode: 400,
      body: `Unknown HTTP method ${event.httpMethod}`,
    };
  } catch (e) {
    if (e && e.name === "NotFound") {
      return {
        statusCode: 404,
        body: e.message || e,
      };
    }
    return { statusCode: 500, body: e.toString() };
  }
};

module.exports = { handler };

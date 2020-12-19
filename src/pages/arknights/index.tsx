import React from "react";
import { StaticQuery, graphql } from "gatsby";

function Home(): React.ReactElement {
  return (
    <StaticQuery
      query={graphql`
        query {
          allOperatorsJson {
            nodes {
              name
              rarity
              isCnOnly
            }
          }
        }
      `}
      render={(data) => (
        <>
          {data.allOperatorsJson.nodes.map((node) => (
            <div>
              <h3>{node.name}</h3>
              <ul>
                <li>
                  Rarity:&nbsp;
                  {node.rarity}
                </li>
                <li>
                  CN Only?&nbsp;
                  {node.isCnOnly ? "true" : "false"}
                </li>
              </ul>
            </div>
          ))}
        </>
      )}
    />
  );
}
export default Home;

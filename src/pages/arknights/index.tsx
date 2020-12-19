import React from "react";
import { useStaticQuery, graphql } from "gatsby";

function Home(): React.ReactElement {
  const data = useStaticQuery(graphql`
    query {
      allOperatorsJson {
        nodes {
          name
          rarity
          isCnOnly
        }
      }
    }
  `);
  return (
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
  );
}
export default Home;

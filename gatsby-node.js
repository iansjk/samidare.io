/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(
    `
      query {
        site {
          siteMetadata {
            pages {
              slug
              pageTitle
            }
          }
        }
      }
    `
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    result.data.site.siteMetadata.pages.forEach((page) => {
      const pageComponent = path.resolve(`src/pages/${page.slug}.tsx`);
      createPage({
        path: page.slug,
        component: pageComponent,
        context: {
          pageTitle: page.pageTitle,
        },
      });
    });
  });
};

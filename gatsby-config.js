/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: "Arknights Tools",
    siteUrl: "https://samidare.io/arknights",
    description:
      "A collection of tools for Arknights, a tower defense mobile game by Hypergryph/Yostar",
  },
  pathPrefix: "/arknights",
  plugins: [
    "gatsby-theme-material-ui",
    "gatsby-plugin-layout",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/data/",
      },
    },
  ],
};

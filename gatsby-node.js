const paths = {
  "/planner": "Operator Planner",
  "/recruitment": "Recruitment Calculator",
  "/gacha": "Pull Probability Calculator",
  "/leveling": "Leveling Costs",
  "/base": "Base Rotation Visualizer",
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  deletePage(page);
  const pathNoTrailingBackslash = page.path.slice(0, -1);
  const pageTitle = paths[pathNoTrailingBackslash] || "";
  console.log(
    "creating page:",
    createPage({
      ...page,
      context: {
        ...page.context,
        pageTitle,
        paths,
      },
    })
  );
};

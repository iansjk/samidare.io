import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import AppFooter from "../components/AppFooter";

const useStyles = makeStyles({
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
});

interface Props {
  children: React.ReactNode;
  uri: string;
}

function getPageTitle(title: string, uri: string): string | null {
  let subtitle = null;
  if (uri.endsWith("planner")) {
    subtitle = "Operator Planner";
  }
  if (uri.endsWith("recruitment")) {
    subtitle = "Recruitment Calculator";
  }
  return `${subtitle ? `${subtitle} · ` : ""}${title}`;
}

function Layout(props: Props): React.ReactElement {
  const { children, uri } = props;
  const classes = useStyles();
  const { title, description } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `).site.siteMetadata;
  const pageTitle = getPageTitle(title, uri);

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className={classes.appContainer}>
        <Container maxWidth="lg">
          <AppBar>
            <Toolbar>
              <Typography component="h1" variant="h4">
                {pageTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box clone mb={2}>
            <Toolbar />
          </Box>
          {children}
        </Container>
        <Box flexGrow={1} />
        <AppFooter />
      </div>
    </>
  );
}
export default Layout;

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
}

function Layout(props: Props): React.ReactElement {
  const { children } = props;
  const classes = useStyles();
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={classes.appContainer}>
      <Container maxWidth="lg">
        <AppBar>
          <Toolbar>
            <Typography component="h1" variant="h4">
              {data.site.siteMetadata.title}
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
  );
}
export default Layout;

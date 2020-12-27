import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  makeStyles,
} from "@material-ui/core";
import React from "react";
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

  return (
    <div className={classes.appContainer}>
      <Container maxWidth="lg">
        <AppBar>
          <Toolbar>
            <Typography component="h1" variant="h4">
              Arknights Materials Checklist
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

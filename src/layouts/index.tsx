import {
  Container as div,
  AppBar,
  Toolbar,
  Typography,
  Box,
  makeStyles,
  CssBaseline,
  IconButton,
  Drawer,
  Hidden,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Container,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Link as GatsbyLink } from "gatsby-theme-material-ui";
import AppFooter from "../components/AppFooter";
import favicon from "../data/images/favicon.ico";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  appWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  appContainer: {
    display: "flex",
  },
  content: {
    padding: theme.spacing(3),
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  headerFooter: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  siteHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    paddingLeft: theme.spacing(2),
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const links = {
  "/planner": "Operator Planner",
  "/recruitment": "Recruitment Calculator",
};

function getPageTitle(title: string, uri: string): string | undefined {
  const subpage = Object.entries(links).find(([pageUri, _]) =>
    uri.endsWith(pageUri)
  );
  return subpage?.[1];
}

interface Props {
  children: React.ReactNode;
  uri: string;
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
  const theme = useTheme();
  const pageTitle = getPageTitle(title, uri);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div>
      <Typography
        className={clsx(classes.toolbar, classes.siteHeader)}
        component="h1"
        variant="h5"
      >
        Arknights Tools
      </Typography>
      <Divider />
      <List>
        {Object.entries(links).map(([pageUri, pageName]) => (
          <ListItem button key={pageName}>
            <ListItemText primary={pageName} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    typeof window !== "undefined" ? window.document.body : undefined;

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="icon" type="image/x-icon" href={favicon} />
      </Helmet>
      <CssBaseline />
      <div className={classes.appWrapper}>
        <div className={classes.appContainer}>
          <AppBar position="fixed" className={classes.headerFooter}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h2" variant="h5" noWrap>
                {pageTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden mdUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <Container className={classes.content} component="main" maxWidth="lg">
            <div className={classes.toolbar} />
            {children}
          </Container>
        </div>
        <Box flexGrow={1} />
        <AppFooter className={classes.headerFooter} />
      </div>
    </>
  );
}
export default Layout;

import {
  AppBar,
  Container,
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
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { Link as GatsbyLink } from "gatsby-theme-material-ui";
import netlifyIdentity, { User } from "netlify-identity-widget";
import AppFooter from "../components/AppFooter";
import favicon from "../data/images/favicon.ico";
import NetlifyLogin from "./components/NetlifyLogin";
import NetlifyLoginContext from "./components/NetlifyLoginContext";

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
    padding: theme.spacing(2),
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  headerFooter: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
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
  mainToolbar: {
    display: "flex",
  },
  pageTitle: {
    flexGrow: 1,
  },
}));

const links = {
  "/planner": "Operator Planner",
  "/recruitment": "Recruitment Calculator",
  "/gacha": "Pull Probability Calculator",
};

function getPageTitle(title: string, uri: string): string | undefined {
  const subpage = Object.entries(links).find(([pageUri, _]) =>
    uri.endsWith(pageUri)
  );
  return subpage?.[1];
}

const useLinkStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary,
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

function ListItemLink({ to, primary }: { to: string; primary: string }) {
  const classes = useLinkStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement>((itemProps, ref) => (
        <li>
          <GatsbyLink to={to} ref={ref} {...itemProps} />
        </li>
      )),
    [to]
  );

  return (
    <ListItem button component={renderLink}>
      <ListItemText className={classes.link} primary={primary} />
    </ListItem>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  uri: string;
}

function Layout(props: LayoutProps): React.ReactElement {
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <>
      <Typography
        className={clsx(classes.toolbar, classes.siteHeader)}
        component="h1"
        variant="h5"
      >
        {title}
      </Typography>
      <Divider />
      <List>
        {Object.entries(links).map(([pageUri, pageName]) => (
          <ListItemLink key={pageUri} to={pageUri} primary={pageName} />
        ))}
      </List>
    </>
  );

  const container =
    typeof window !== "undefined" ? window.document.body : undefined;

  useEffect(() => netlifyIdentity.init(), []);

  return (
    <NetlifyLoginContext.Provider value={{ currentUser, setCurrentUser }}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" type="image/x-icon" href={favicon} />
      </Helmet>
      <CssBaseline />
      <div className={classes.appWrapper}>
        <div className={classes.appContainer}>
          <nav className={classes.drawer}>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden lgUp implementation="css">
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
            <Hidden mdDown implementation="css">
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
          <AppBar position="fixed" className={classes.headerFooter}>
            <Toolbar className={classes.mainToolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h2"
                variant="h5"
                noWrap
                className={classes.pageTitle}
              >
                {pageTitle}
              </Typography>
              {/* <NetlifyLogin /> */}
            </Toolbar>
          </AppBar>
          <Container className={classes.content} component="main" maxWidth="lg">
            <div className={classes.toolbar} />
            {children}
          </Container>
        </div>
        <Box flexGrow={1} />
        <AppFooter className={classes.headerFooter} />
      </div>
    </NetlifyLoginContext.Provider>
  );
}
export default Layout;

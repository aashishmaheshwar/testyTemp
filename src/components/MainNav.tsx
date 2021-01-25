import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles({
  selectedLink: {
    background: "lightgrey",
  },
});

export default function MainNav() {
  const classes = useStyles();

  return (
    <Box display="flex" bgcolor="grey.200" p={2} alignItems="center">
      <Box pr={1} marginRight="20px">
        <Typography>ESG Trade Enabler</Typography>
      </Box>
      <Box>
        <Button
          color="primary"
          component={NavLink}
          activeClassName={classes.selectedLink}
          to={"/tradeModel"}
        >
          Trade Model
        </Button>
        <Button
          color="primary"
          component={NavLink}
          activeClassName={classes.selectedLink}
          to={"/businessEvent"}
        >
          Business Event
        </Button>
        <Button
          color="primary"
          component={NavLink}
          activeClassName={classes.selectedLink}
          to={"/ruleModel"}
        >
          Rule Model
        </Button>
      </Box>
      <Box flexGrow={1} textAlign="right">
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

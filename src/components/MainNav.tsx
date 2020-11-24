import React from "react";
import { Box, Typography, Button, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function MainNav() {
  return (
    <Box display="flex" bgcolor="grey.200" p={2} alignItems="center">
      <Box pr={1}>
        <Typography>ESG Trade Enabler</Typography>
      </Box>
      <Box>
        <Button color="primary">Trade Models</Button>
        <Button color="primary">Business Events</Button>
        <Button color="primary">Rules</Button>
        <Button color="primary">Trades</Button>
      </Box>
      <Box flexGrow={1} textAlign="right">
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

import React from "react";
import { Box, Typography, Button, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function MainNav() {
  return (
    <Box display="flex" bgcolor="grey.200" p={2} alignItems="center">
      <Box pr={1} marginRight="20px">
        <Typography>ESG Trade Enabler</Typography>
      </Box>
      <Box>
        <Button color="primary">Trade</Button>
        <Button color="primary">Trade Model</Button>
        <Button color="primary">Business Event</Button>
        <Button color="primary">Rule</Button>
        <Button color="primary">Mapping</Button>
      </Box>
      <Box flexGrow={1} textAlign="right">
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

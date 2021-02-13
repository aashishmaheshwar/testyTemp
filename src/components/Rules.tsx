import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { StyledTableCell, StyledTableRow } from "./../core/Table";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import createRuleModelMutation from "./RuleModel";
import { env } from "../core/Environment";
import axios from "axios";
import { useQuery } from "react-query";
import RuleModel from "./RuleModel";

export const getRuleTypes = async () => {
  const { data } = await axios.get(env.apiHostName + env.apis.getRuleTypes);
  return data;
};

export const getRuleIdsForRuleType = async (type: string) => {
  const { data } = await axios.get(
    `${env.apiHostName}/${env.apis.getRuleIdsForRuleType}/?type=${type}`
  );
  return data;
};

const getRuleModels = async () => {
  const { data: ruleTypes } = await getRuleTypes();
  // ruleTypes.map(({id}) => id) do parallel get to fetch all ids, then get all rules
  return;
};

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "5px",
    margin: 0,
    marginTop: "8px",
  },
  chip: {
    margin: "2px",
  },
  attributeLabel: {
    paddingTop: "8px",
    display: "flex",
    alignItems: "center",
  },
  attributeInputBlur: {
    opacity: 0.3,
  },
  attributeInputFocus: {
    opacity: 1,
  },
});

const mockAPIData = [
  {
    ruleId: "R00007845",
    ruleName: "BaNCS SP Cash Booking",
    ruleType: "ACC",
    attributes: [
      {
        id: "ATTR001",
        name: "dr_cr_flag",
        type: "ENUM",
        values: ["DR", "CR"],
      },
      {
        id: "ATTR002",
        name: "currency",
        type: "CHAR",
        length: "4",
      },
      {
        id: "ATTR003",
        name: "amount",
        type: "DECIMAL",
        length: "21,9",
      },
      {
        id: "ATTR004",
        name: "entry_time",
        type: "TIME",
      },
    ],
  },
];

const Rules = () => {
  const classes = useStyles();
  // const rows = useQuery('ruleModels', getRuleModels);
  const [selectedRule, setSelectedRule] = useState<
    typeof mockAPIData[0] | null
  >(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(mockAPIData);
  const history = useHistory();

  return (
    <Box>
      {selectedRule && (
        <RuleModel
          open={!!selectedRule}
          event={selectedRule}
          onClose={() => {
            setSelectedRule(null);
          }}
        />
      )}
      {open && (
        <RuleModel
          isNew
          open
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
      <Box display="flex" justifyContent="flex-end" marginBottom="20px">
        <Button
          color="primary"
          variant="outlined"
          size="small"
          onClick={() => setOpen(true)}
        >
          + New Rule
        </Button>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Rules">
            <TableHead>
              <TableRow>
                <StyledTableCell>Rule ID</StyledTableCell>
                <StyledTableCell>Rule Name</StyledTableCell>
                <StyledTableCell>Rule Type</StyledTableCell>
                <StyledTableCell>Edit / Show</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.ruleId}>
                  <StyledTableCell component="th" scope="row">
                    {row.ruleId}
                  </StyledTableCell>
                  <StyledTableCell>{row.ruleName}</StyledTableCell>
                  <StyledTableCell>{row.ruleType}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedRule(row)}
                    >
                      Show/ Edit Details
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Rules;

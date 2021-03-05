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
import { useHistory, useLocation } from "react-router-dom";
import BusinessRuleMapper from "./BusinessRuleMapper";
import { env } from "../core/Environment";
import axios from "axios";
import { useQuery } from "react-query";

// A custom hook that builds on useLocation to parse
// the query string for you.
export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

export const getBusinessEventRules = (businessEventId: string) => async () => {
  const { data } = await axios.get(
    `${env.apiHostName}/${env.apis.getBusinessEventRules}?businessEventId=${businessEventId}`
  );
  return data;
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
    businessEventRuleId: "BER0000786",
    ruleType: "ACC",
    ruleId: "R00001734",
    mapping: [
      {
        businessEventRuleMappingId: "BERM00001",
        attributeName: "dr_cr_flag",
        type: "function",
        functionName: "COMM-Fn-MapSide",
        properties: ["Side", "LastQty"], // functionArgs
      },
      {
        businessEventRuleMappingId: "BERM00002",
        attributeName: "entry_date",
        type: "value",
        properties: ["TrdDt"], // mappedTo
      },
    ],
  },
];

const BusinessRules = () => {
  const classes = useStyles();
  const [selectedBusinessEventRule, setSelectedBusinessEventRule] = useState<
    typeof mockAPIData[0] | null
  >(null);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const businessEventId = useQueryParams().get("businessEventId");

  if (!businessEventId) {
    history.push("/businessEvent");
  }

  const {
    data: rows,
    isFetching: isBusinessEventRuleModelsFetching,
    status,
    error,
  } = useQuery(
    "businessEventRules",
    getBusinessEventRules(businessEventId as string)
  );
  // const [rows, setRows] = useState(mockAPIData);

  return (
    <Box>
      {selectedBusinessEventRule && (
        <BusinessRuleMapper
          open={!!selectedBusinessEventRule}
          event={selectedBusinessEventRule}
          onClose={() => {
            setSelectedBusinessEventRule(null);
          }}
        />
      )}
      {open && (
        <BusinessRuleMapper
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
          + New Business Event Rule
        </Button>
      </Box>
      <Box>
        {isBusinessEventRuleModelsFetching ? (
          "Fetching business event rules"
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="Business Event Rules">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Business Event Rule ID</StyledTableCell>
                  <StyledTableCell>Rule Type</StyledTableCell>
                  <StyledTableCell>Rule Id</StyledTableCell>
                  <StyledTableCell>Edit / Show</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows || []).map((row: any) => (
                  <StyledTableRow key={row.businessEventRuleId}>
                    <StyledTableCell component="th" scope="row">
                      {row.businessEventRuleId}
                    </StyledTableCell>
                    <StyledTableCell>{row.ruleType}</StyledTableCell>
                    <StyledTableCell>{row.ruleId}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        color="primary"
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedBusinessEventRule(row)}
                      >
                        Show/ Edit Details
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default BusinessRules;

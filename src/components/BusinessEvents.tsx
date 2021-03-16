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
import BusinessEvent from "./BusinessEvent";
import { Button, TablePagination } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { env } from "../core/Environment";
import axios from "axios";
import { useQuery } from "react-query";

const getBusinessEvents = async () => {
  const { data } = await axios.get(
    `${env.apiHostName}/${env.apis.getBusinessEvents}`
  );
  return (data as Array<any>).map((item) => {
    const { triggerCondition: strTriggerCondition, ...rest } = item;
    const triggerCondition = JSON.parse(strTriggerCondition);
    return { ...rest, triggerCondition };
  });
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
    businessEventId: "BE0001",
    businessEventName: "event A",
    tradeModelId: "800a5e13-8c1a-4138-908c-bdabc91d579e",
    triggerCondition: {
      and: [
        {
          "==": [
            {
              var: "Exec",
            },
            2,
          ],
        },
      ],
    },
  },
  {
    businessEventId: "BE0002",
    businessEventName: "event B",
    tradeModelId: "3cb86bac-0fbb-49b7-9c47-32cc9e3d6478",
    triggerCondition: {
      and: [
        {
          "==": [
            {
              var: "LeavesQty",
            },
            2,
          ],
        },
      ],
    },
  },
];

const BusinessEvents = () => {
  const classes = useStyles();
  const [selectedEvent, setSelectedEvent] = useState<
    typeof mockAPIData[0] | null
  >(null);
  const [open, setOpen] = useState(false);
  // const [rows, setRows] = useState(mockAPIData);
  const { data: rows, error, isFetching } = useQuery(
    "businessEvents",
    getBusinessEvents
  );
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {selectedEvent && (
        <BusinessEvent
          open={!!selectedEvent}
          event={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
          }}
        />
      )}
      {open && (
        <BusinessEvent
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
          + New Business Event
        </Button>
      </Box>
      {isFetching ? (
        "Fetching Business Events"
      ) : (
        <Box>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="Business Events">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Business Event ID</StyledTableCell>
                  <StyledTableCell>Business Event Name</StyledTableCell>
                  <StyledTableCell>Trade Model ID</StyledTableCell>
                  <StyledTableCell>Edit / Show</StyledTableCell>
                  <StyledTableCell>Rules</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows || [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any) => (
                    <StyledTableRow key={row.businessEventId}>
                      <StyledTableCell component="th" scope="row">
                        {row.businessEventId}
                      </StyledTableCell>
                      <StyledTableCell>{row.businessEventName}</StyledTableCell>
                      <StyledTableCell>{row.tradeModelId}</StyledTableCell>
                      <StyledTableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() => setSelectedEvent(row)}
                        >
                          Show/ Edit Details
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            history.push(
                              `/businessRuleMapper?businessEventId=${row.businessEventId}&tradeModelId=${row.tradeModelId}`
                            )
                          }
                        >
                          Create/ Show rules
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={(rows || []).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default BusinessEvents;

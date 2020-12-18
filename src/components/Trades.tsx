import Box from "@material-ui/core/Box";
import React, { useState } from "react";
import "../css/Trades.css";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { StyledTableCell, StyledTableRow } from "./../core/Table";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import HelpIcon from "@material-ui/icons/Help";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Input from "@material-ui/core/Input";
import { AttributeType, TradeAttributes } from "./../types/Trade";
import TradeModel from "./TradeModel";
import { useFormik } from "formik";
import { TradeModelValidationSchema } from "../configs/TradeModel";
import { FormHelperText } from "@material-ui/core";

function createData(
  tradeModelId: string,
  tradeModelName: string,
  tradeChannelName: string,
  attributes: Array<AttributeType>
) {
  return { tradeModelId, tradeModelName, tradeChannelName, attributes };
}

const rows = [
  createData("TM000027", "XP Investments - Equity", "XP Investments - Fix", [
    "LastMkt",
    "ExecTyp",
  ]),
  createData("TM000028", "MP Investments - Equity", "MP Investments - Fix", [
    "CumQty",
    "LeavesQty",
    "TrdDt",
  ]),
  createData("TM000030", "MLM Investments - Forex", "MLM Investments - Fix", [
    "TxnTM",
    "LastPX",
    "LastMkt",
  ]),
];

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

const Trades = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null as any);
  const [selectedAttrs, setSelectedAttrs] = useState(
    new Set<AttributeType | string>()
  );
  const [allAttributes, setAllAttributes] = useState(
    new Set<AttributeType | string>(TradeAttributes)
  );
  const [chipInputVal, setChipInputVal] = useState("");

  const formik = useFormik({
    initialValues: {
      tradeModelName: "",
      tradeChannelName: "",
    },
    validationSchema: TradeModelValidationSchema,
    onSubmit: (values) => {
      alert(
        JSON.stringify(
          { ...values, attributes: Array.from(selectedAttrs) },
          null,
          2
        )
      );
      if (selectedAttrs.size) {
        // make the API call here - await
        handleClose();
      }
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAttrs(new Set());
    formik.resetForm();
    setOpen(false);
    setAllAttributes(new Set(TradeAttributes));
  };

  const handleDelete = (attr: string) => {
    setSelectedAttrs((oldAttrs) => {
      oldAttrs.delete(attr);
      return new Set([...Array.from(oldAttrs)]);
    });
  };

  const handleClick = (attr: string) => {
    if (selectedAttrs.has(attr)) {
      handleDelete(attr);
      return;
    }
    setSelectedAttrs((oldAttrs) => {
      return new Set([...Array.from(oldAttrs), attr]);
    });
  };

  const isDisabled = (): boolean => {
    if (!selectedAttrs.size) {
      return true;
    }
    return !(formik.dirty && formik.isValid);
  };

  const chipInputOnKeyPress = (e: any) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      setSelectedAttrs((oldAttrs) => {
        return new Set([...Array.from(oldAttrs), chipInputVal]);
      });
      setAllAttributes((oldAttrs) => {
        return new Set([...Array.from(oldAttrs), chipInputVal]);
      });
      setChipInputVal("");
    }
  };

  const chipInputOnChange = (e: any) => {
    setChipInputVal(e.target.value.trim());
  };

  const buildFormDetails = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="trade-model-details-dialog"
      >
        <DialogTitle id="trade-model-details-dialog">
          Trade Model Details
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              To create a new trade model enter the below information.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Trade Model Name"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
              name="tradeModelName"
              value={formik.values.tradeModelName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.tradeModelName &&
                Boolean(formik.errors.tradeModelName)
              }
              helperText={
                formik.touched.tradeModelName && formik.errors.tradeModelName
              }
            />
            <TextField
              margin="dense"
              label="Trade Channel Name"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required
              name="tradeChannelName"
              value={formik.values.tradeChannelName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.tradeChannelName &&
                Boolean(formik.errors.tradeChannelName)
              }
              helperText={
                formik.touched.tradeChannelName &&
                formik.errors.tradeChannelName
              }
            />
            <InputLabel
              required
              shrink={true}
              classes={{
                root: classes.attributeLabel,
              }}
              error={!selectedAttrs.size && formik.dirty}
            >
              Trade Attributes&nbsp;
              <Tooltip title="Select atleast one attribute">
                <HelpIcon />
              </Tooltip>
              &nbsp;
            </InputLabel>
            <Paper component="ul" className={classes.root} elevation={3}>
              {Array.from(allAttributes).map((attribute, idx) => {
                return (
                  <li key={idx}>
                    <Chip
                      label={attribute}
                      clickable
                      variant="outlined"
                      color={
                        selectedAttrs.has(attribute) ? "primary" : undefined
                      }
                      onClick={() => handleClick(attribute)}
                      onDelete={
                        selectedAttrs.has(attribute)
                          ? () => handleDelete(attribute)
                          : undefined
                      }
                      deleteIcon={
                        selectedAttrs.has(attribute) ? <DoneIcon /> : undefined
                      }
                      className={classes.chip}
                    />
                  </li>
                );
              })}
              <li>
                <Input
                  classes={{
                    root: classes.attributeInputBlur,
                    focused: classes.attributeInputFocus,
                  }}
                  onKeyPress={chipInputOnKeyPress}
                  value={chipInputVal}
                  onChange={chipInputOnChange}
                />
              </li>
            </Paper>
            {!selectedAttrs.size && (
              <FormHelperText error={formik.dirty}>
                Atleast one attribute must be selected
              </FormHelperText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isDisabled()}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  return (
    <Box>
      {selectedTrade && (
        <TradeModel
          open={!!selectedTrade}
          trade={selectedTrade}
          onClose={() => {
            setSelectedTrade(null);
          }}
        />
      )}
      {buildFormDetails()}
      <Box display="flex" justifyContent="flex-end" marginBottom="20px">
        <Button
          color="primary"
          variant="outlined"
          size="small"
          onClick={handleClickOpen}
        >
          + New Trade
        </Button>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Trade Models">
            <TableHead>
              <TableRow>
                <StyledTableCell>Trade ID</StyledTableCell>
                <StyledTableCell>Trade Model Name</StyledTableCell>
                <StyledTableCell>Trade Channel Name</StyledTableCell>
                <StyledTableCell>Show Trade Model</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.tradeModelId}>
                  <StyledTableCell component="th" scope="row">
                    {row.tradeModelId}
                  </StyledTableCell>
                  <StyledTableCell>{row.tradeModelName}</StyledTableCell>
                  <StyledTableCell>{row.tradeChannelName}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedTrade(row)}
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

export default Trades;

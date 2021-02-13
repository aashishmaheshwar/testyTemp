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
import { AttributeType, Trade, TradeAttributes } from "./../types/Trade";
import TradeModel from "./TradeModel";
import { useFormik } from "formik";
import { TradeModelValidationSchema } from "../configs/TradeModel";
import { Autocomplete } from "@material-ui/lab";
import { env } from "../core/Environment";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

const getTradeModels = async () => {
  const { data } = await axios.get(env.apiHostName + env.apis.getTradeModels);
  return data;
};

export const getAttributes = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    env.apiHostName + env.apis.getAttributes,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// function createData(
//   tradeModelId: string,
//   tradeModelName: string,
//   tradeChannelName: string,
//   attributes: Array<AttributeType>
// ) {
//   return { tradeModelId, tradeModelName, tradeChannelName, attributes };
// }

// const rows = [
//   createData("TM000027", "XP Investments - Equity", "XP Investments - Fix", [
//     "LastMkt",
//     "ExecTyp",
//   ]),
//   createData("TM000028", "MP Investments - Equity", "MP Investments - Fix", [
//     "CumQty",
//     "LeavesQty",
//     "TrdDt",
//   ]),
//   createData("TM000030", "MLM Investments - Forex", "MLM Investments - Fix", [
//     "TxnTM",
//     "LastPX",
//     "LastMkt",
//   ]),
// ];

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

const createTradeModel = async (value: Trade) => {
  const { data } = await axios.post(
    env.apiHostName + env.apis.createTradeModel,
    value
  );
  return data;
};

const Trades = () => {
  const { status, data: rows, error, isFetching } = useQuery(
    "tradeModels",
    getTradeModels
  );
  const queryClient = useQueryClient();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null as any);
  const [allAttributes, setAllAttributes] = useState<
    Set<AttributeType | string>
  >(new Set([]) as Set<AttributeType | string>);
  // Mutations
  const tradeModelMutation = useMutation(createTradeModel, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("tradeModels");
    },
  });
  const getAttributesMutation = useMutation(getAttributes, {
    onSuccess: (value) => {
      // console.log("resonse from get attr", value);
      setAllAttributes(new Set(value));
      formik.setFieldError("sampleFile", "");
    },
    onError: (error) => {
      setAllAttributes(new Set([]));
      formik.setFieldError("sampleFile", (error as any).message);
    },
  });
  // new Set<AttributeType | string>(TradeAttributes)

  const formik = useFormik({
    initialValues: {
      tradeModelName: "",
      tradeChannelName: "",
      attributes: [],
      sampleFile: "",
      // sampleTrade: ''
    },
    validationSchema: TradeModelValidationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      const { sampleFile, ...rest } = values;
      tradeModelMutation.mutate(rest as any);
      handleClose();
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setAllAttributes(new Set([]));
    setOpen(false);
  };

  const isDisabled = (): boolean => {
    return !(formik.dirty && formik.isValid);
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
            <TextField
              type="file"
              fullWidth
              name="sampleFile"
              margin="dense"
              label="Upload a sample trade to fetch the attributes"
              InputLabelProps={{
                shrink: true,
              }}
              required
              onChange={(e) => {
                // console.log("file is ", (e.target as any).files[0]);
                // make post call here to http://35.236.18.89/model-design/api/v1/readXml
                getAttributesMutation.mutate((e.target as any).files[0]);
                // until API starts working
                // setAllAttributes(new Set(TradeAttributes));
              }}
              error={Boolean(formik.errors.sampleFile)}
              helperText={
                allAttributes?.size
                  ? formik.errors.sampleFile
                    ? "Upload call failed"
                    : "Sample Trade uploaded successfully"
                  : formik.errors.sampleFile
                  ? "Upload call failed"
                  : ""
              }
            />
            <Autocomplete
              multiple
              id="attributesId"
              disabled={!allAttributes.size}
              options={Array.from(allAttributes)}
              value={formik.values.attributes}
              onChange={(e, value) => formik.setFieldValue("attributes", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  label="Trade Attributes*"
                  placeholder="Add Attributes"
                  onBlur={formik.handleBlur}
                  error={!formik.values.attributes.length && formik.dirty}
                  helperText={
                    !formik.values.attributes.length && formik.dirty
                      ? "Atleast one attribute must be selected"
                      : ""
                  }
                />
              )}
            />
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
          + New Trade Model
        </Button>
      </Box>
      <Box>
        {isFetching ? (
          "Loading"
        ) : status === "error" ? (
          <span>Error: {(error as any)?.message}</span>
        ) : (
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
                {rows.map((row: any) => (
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
        )}
      </Box>
    </Box>
  );
};

export default Trades;

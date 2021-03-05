import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { AttributeType, Trade, TradeAttributes } from "./../types/Trade";
import { TradeModelValidationSchema } from "../configs/TradeModel";
import { useFormik } from "formik";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useMutation, useQueryClient } from "react-query";
import { env } from "../core/Environment";
import axios from "axios";
import { getAttributes } from "./Trades";

const updateTradeModel = async (value: Trade) => {
  const { data } = await axios.put(
    `${env.apiHostName}/${env.apis.updateTradeModel}`,
    value
  );
  return data;
};

const TradeModel: React.FC<{
  open: boolean;
  onClose: any;
  trade: Trade;
}> = ({ open, onClose, trade }) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [allAttributes, setAllAttributes] = useState(
    new Set<AttributeType | string>([])
  );
  const queryClient = useQueryClient();
  // Mutations
  const tradeModelMutation = useMutation(updateTradeModel, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("tradeModels");
      setAlertMsg("Saved successfully");
    },
    onError: (error) => {
      setAlertMsg((error as any).message);
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

  const formik = useFormik({
    initialValues: {
      tradeModelId: trade.tradeModelId,
      tradeModelName: trade.tradeModelName,
      tradeChannelName: trade.tradeChannelName,
      attributes: trade.attributes,
      sampleFile: "",
    },
    validationSchema: TradeModelValidationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      const { sampleFile, ...rest } = values;
      tradeModelMutation.mutate(rest as any);
    },
  });

  const isDisabled = (): boolean => {
    return !(formik.dirty && formik.isValid);
  };

  const handleAlertClose = () => {
    if (alertMsg === "Saved successfully") {
      onClose();
    }
    setAlertMsg("");
  };

  return (
    <>
      <Snackbar
        open={!!alertMsg}
        autoHideDuration={2000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertMsg.includes("success") ? "success" : "error"}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={onClose}
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
              label="Trade Model Id"
              InputLabelProps={{
                shrink: true,
              }}
              name="tradeModelId"
              fullWidth
              disabled
              value={formik.values.tradeModelId}
            />
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
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isDisabled()}>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TradeModel;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { AttributeType, Trade, TradeAttributes } from "./../types/Trade";
import { TradeModelValidationSchema } from "../configs/TradeModel";
import { useFormik } from "formik";
import { Autocomplete } from "@material-ui/lab";

const TradeModel: React.FC<{
  open: boolean;
  onClose: any;
  trade: Trade;
}> = ({ open, onClose, trade }) => {
  const [allAttributes, setAllAttributes] = useState(
    new Set<AttributeType | string>([...TradeAttributes, ...trade.attributes])
  );

  const formik = useFormik({
    initialValues: {
      tradeModelId: trade.tradeModelId,
      tradeModelName: trade.tradeModelName,
      tradeChannelName: trade.tradeChannelName,
      attributes: trade.attributes,
    },
    validationSchema: TradeModelValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      onClose();
    },
  });

  const isDisabled = (): boolean => {
    return !(formik.dirty && formik.isValid);
  };

  return (
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
              formik.touched.tradeChannelName && formik.errors.tradeChannelName
            }
          />
          <Autocomplete
            multiple
            id="attributesId"
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
  );
};

export default TradeModel;

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";
import HelpIcon from "@material-ui/icons/Help";
import DoneIcon from "@material-ui/icons/Done";
import { AttributeType, Trade, TradeAttributes } from "./../types/Trade";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormHelperText } from "@material-ui/core";

const useStyles = makeStyles({
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
});

const validationSchema = yup.object().shape({
  tradeModelName: yup.string().required("Trade Model Name is required"),
  tradeChannelName: yup.string().required("Trade Channel Name is required"),
});

const TradeModel: React.FC<{
  open: boolean;
  onClose: any;
  trade: Trade;
}> = ({ open, onClose, trade }) => {
  const classes = useStyles();
  const [selectedAttrs, setSelectedAttrs] = useState(
    new Set<AttributeType>(trade.attributes)
  );

  const formik = useFormik({
    initialValues: {
      tradeModelId: trade.tradeModelId,
      tradeModelName: trade.tradeModelName,
      tradeChannelName: trade.tradeChannelName,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      if (selectedAttrs.size) {
        // make the API call here
        onClose();
      }
    },
  });

  const handleDelete = (attr: AttributeType) => {
    // formik.dirty = true;
    setSelectedAttrs((oldAttrs) => {
      oldAttrs.delete(attr);
      //   formik.isValid = oldAttrs.size ? formik.isValid && true : false;
      return new Set([...Array.from(oldAttrs)]);
    });
  };

  const handleClick = (attr: AttributeType) => {
    // formik.dirty = true;
    if (selectedAttrs.has(attr)) {
      handleDelete(attr);
      return;
    }
    // formik.isValid = formik.isValid && true;
    setSelectedAttrs((oldAttrs) => {
      return new Set([...Array.from(oldAttrs), attr]);
    });
  };

  const didTradeAttributesChange = (): boolean => {
    return !(
      selectedAttrs.size === trade.attributes.length &&
      trade.attributes.every((elem) => selectedAttrs.has(elem))
    );
  };

  const isDisabled = (): boolean => {
    const attrsChanged: boolean = didTradeAttributesChange();
    if (!selectedAttrs.size) {
      //  || !attrsChanged
      return true;
    }
    if (attrsChanged) {
      return true && !formik.isValid;
    }
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
          <InputLabel
            required
            shrink={true}
            classes={{
              root: classes.attributeLabel,
            }}
            error={!selectedAttrs.size}
          >
            Trade Attributes&nbsp;
            <Tooltip title="Select atleast one attribute">
              <HelpIcon />
            </Tooltip>
            &nbsp;
          </InputLabel>
          <Paper component="ul" className={classes.root} elevation={3}>
            {TradeAttributes.map((attribute, idx) => {
              return (
                <li key={idx}>
                  <Chip
                    label={attribute}
                    clickable
                    variant="outlined"
                    color={selectedAttrs.has(attribute) ? "primary" : undefined}
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
          </Paper>
          {!selectedAttrs.size && (
            <FormHelperText error>
              Atleast one attribute must be selected
            </FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isDisabled()}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TradeModel;

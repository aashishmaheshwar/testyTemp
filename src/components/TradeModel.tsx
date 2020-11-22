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
import { AttributeType, TradeAttributes } from "./../types/Trade";

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

type Trade = {
  tradeId: string;
  tradeModelName: string;
  tradeChannelName: string;
  attributes: Array<AttributeType>;
};

const TradeModel: React.FC<{
  open: boolean;
  onClose: any;
  trade: Trade;
}> = ({ open, onClose, trade }) => {
  const classes = useStyles();
  const [selectedAttrs, setSelectedAttrs] = useState(
    new Set<AttributeType>(trade.attributes)
  );

  const handleDelete = (attr: AttributeType) => {
    setSelectedAttrs((oldAttrs) => {
      oldAttrs.delete(attr);
      return new Set([...Array.from(oldAttrs)]);
    });
  };

  const handleClick = (attr: AttributeType) => {
    if (selectedAttrs.has(attr)) {
      handleDelete(attr);
      return;
    }
    setSelectedAttrs((oldAttrs) => {
      return new Set([...Array.from(oldAttrs), attr]);
    });
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
          fullWidth
          disabled
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
        />
        <TextField
          margin="dense"
          label="Trade Channel Name"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          required
        />
        <InputLabel
          required
          shrink={true}
          classes={{
            root: classes.attributeLabel,
          }}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeModel;

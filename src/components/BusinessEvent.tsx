import React from "react";
import Box from "@material-ui/core/Box";
import { useFormik } from "formik";
import RuleQueryBuilder from "../core/components/QueryBuilder";
import BusinessEventTriggerConfig from "../configs/BusinessEventTriggerConfig";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputLabel,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HelpIcon from "@material-ui/icons/Help";
import { BusinessEventValidationSchema } from "../configs/BusinessEvent";
import { useHistory } from "react-router-dom";

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
  attributeInputBlur: {
    opacity: 0.3,
  },
  attributeInputFocus: {
    opacity: 1,
  },
  triggerConditionLabel: {
    textAlign: "start",
  },
  businessEventName: {
    marginBottom: "15px",
  },
});

const tradeModels = [{ id: "TM000027", name: "XP Investments - Equity" }];

type BusinessEventProps = {
  isNew?: boolean;
  open?: boolean;
  event?: any;
  onClose: any;
};

const BusinessEvent = ({
  isNew = false,
  open = false,
  event,
  onClose,
}: BusinessEventProps) => {
  const classes = useStyles();
  const history = useHistory();
  const formik = useFormik({
    // initial values from API
    initialValues: isNew
      ? {
          businessEventId: "",
          businessEventName: "",
          tradeModelId: null,
          triggerCondition: "",
        }
      : { ...event },
    validationSchema: BusinessEventValidationSchema,
    // validateOnBlur: false,
    onSubmit: (values) => {
      const {
        tradeModelId: { id: tradeModelId },
      } = values as any;
      let postData: any = { ...values, tradeModelId };
      if (isNew) {
        delete postData.businessEventId;
      }
      alert(JSON.stringify(postData, null, 2));
      history.push("/businessRuleMapper");
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="business-event-details-dialog"
    >
      <DialogTitle id="business-event-details-dialog">
        {isNew ? "Create new Business Event" : "Show/Edit Business Event"}
      </DialogTitle>
      {/* <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew ? "Create new Business Event" : "Show/Edit Business Event"}
      </Typography> */}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText>
            {isNew
              ? `To create a new business Event enter the below information.`
              : `Update details to modify an existing business Event`}
          </DialogContentText>
          {!isNew && (
            <TextField
              margin="dense"
              label="Business Event Id"
              InputLabelProps={{
                shrink: true,
              }}
              name="businessEventId"
              fullWidth
              disabled
              value={formik.values.businessEventId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          )}
          <TextField
            autoFocus
            required
            margin="dense"
            label="Business Event Name"
            InputLabelProps={{
              shrink: true,
            }}
            name="businessEventName"
            fullWidth
            value={formik.values.businessEventName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={
              formik.touched.businessEventName &&
              Boolean(formik.errors.businessEventName)
            }
            helperText={
              formik.touched.businessEventName &&
              formik.errors.businessEventName
            }
            className={classes.businessEventName}
          />
          {/* trade model id drop down */}
          <Autocomplete
            // id="combo-box-demo"
            fullWidth
            value={formik.values.tradeModelId as any}
            onChange={(event: any, newValue: any | null) => {
              formik.setFieldValue("tradeModelId", newValue);
            }}
            options={tradeModels} // fetched asynchronously; maybe elastic search
            getOptionLabel={({ id, name }: { id: string; name: string }) =>
              `${id} : ${name}`
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                required
                label="Trade Model Id"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <br />
          <InputLabel
            required
            shrink={true}
            htmlFor="businessEventTriggerCondition"
            classes={{
              root: classes.triggerConditionLabel,
            }}
          >
            Configure Rules&nbsp;
            <Tooltip title="Add rules to create a trigger condition">
              <HelpIcon />
            </Tooltip>
            &nbsp;
          </InputLabel>
          <RuleQueryBuilder
            buildConfig={BusinessEventTriggerConfig}
            condition={formik.values.triggerCondition} // renders only once
            onTriggerCondition={(e: string) => {
              !formik.touched.triggerCondition &&
                (formik.values.triggerCondition || e) &&
                formik.setFieldTouched("triggerCondition", true);
              if (e) {
                formik.setFieldError("triggerCondition", "");
              }
              /*else {
              if (formik.values.triggerCondition) {

              }
            }*/
              formik.setFieldValue("triggerCondition", e);
            }}
          />
          <TextField
            margin="dense"
            required
            disabled
            multiline
            label="Trigger Condition"
            InputLabelProps={{
              shrink: true,
            }}
            name="triggerCondition"
            id="businessEventTriggerCondition"
            fullWidth
            value={JSON.stringify(formik.values.triggerCondition, null, 2)}
            error={
              formik.touched.triggerCondition &&
              Boolean(formik.errors.triggerCondition)
            }
            helperText={
              formik.touched.triggerCondition && formik.errors.triggerCondition
            }
            // disabled={!formik.errors.triggerCondition}
          />
          <Box>
            <Button color="primary" type="submit">
              Next
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default BusinessEvent;

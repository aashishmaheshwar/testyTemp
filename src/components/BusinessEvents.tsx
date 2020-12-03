import React from "react";
import Box from "@material-ui/core/Box";
import { useFormik } from "formik";
import RuleQueryBuilder from "../core/components/QueryBuilder";
import BusinessEventTriggerConfig from "../configs/BusinessEventTriggerConfig";
import {
  Button,
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

const useStyles = makeStyles({
  triggerConditionLabel: {
    textAlign: "start",
  },
  businessEventName: {
    marginBottom: "15px",
  },
});

const tradeModels = [{ id: "TM000027", name: "XP Investments - Equity" }];

const BusinessEvents = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useStyles();
  const formik = useFormik({
    // initial values from API
    initialValues: {
      businessEventId: "",
      businessEventName: "",
      tradeModelId: null,
      triggerCondition: "",
    },
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
    },
  });

  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew ? "Create new Business Event" : "Show/Edit Business Event"}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
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
            formik.touched.businessEventName && formik.errors.businessEventName
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
          value={formik.values.triggerCondition}
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
      </form>
    </Box>
  );
};

export default BusinessEvents;

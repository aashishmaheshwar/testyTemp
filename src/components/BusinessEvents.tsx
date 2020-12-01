import React from "react";
import Box from "@material-ui/core/Box";
import { useFormik } from "formik";
import RuleQueryBuilder from "../core/components/QueryBuilder";
import BusinessEventTriggerConfig from "../configs/BusinessEventTriggerConfig";
import {
  Input,
  InputLabel,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles({
  triggerConditionLabel: {
    textAlign: "start",
  },
});

const BusinessEvents = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      businessEventId: "",
      businessEventName: "",
      tradeModelId: "",
      triggerCondition: "",
    },
    // validationSchema: TradeModelValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
            autoFocus
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
            error={
              formik.touched.businessEventId &&
              Boolean(formik.errors.businessEventId)
            }
            helperText={
              formik.touched.businessEventId && formik.errors.businessEventId
            }
          />
        )}
        <TextField
          autoFocus
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
        />
        {/* trade model id drop down */}
        <InputLabel
          required
          shrink={true}
          htmlFor="businessEventTriggerCondition"
          classes={{
            root: classes.triggerConditionLabel,
          }}
          // error={!selectedAttrs.size}
        >
          Trigger Condition&nbsp;
          <Tooltip title="Add rules to create a trigger condition">
            <HelpIcon />
          </Tooltip>
          &nbsp;
        </InputLabel>
        <RuleQueryBuilder
          buildConfig={BusinessEventTriggerConfig}
          onTriggerCondition={(e: string) => {
            formik.setFieldValue("triggerCondition", e);
          }}
        />
        <Input
          margin="dense"
          name="triggerCondition"
          fullWidth
          value={formik.values.triggerCondition}
          //   disabled
          id="businessEventTriggerCondition"
        />
      </form>
      {/* <form onSubmit={formik.handleSubmit}>
            To create a new trade model enter the below information.
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
            <FormHelperText error>
              Atleast one attribute must be selected
            </FormHelperText>
          <Box>
        //       <Button onClick={onClose} color="primary">
        //     Cancel
        //   </Button> 
          <Button color="primary" type="submit"> 
          // disabled={isDisabled()} 
            Next
          </Button>
          </Box>
      </form> */}
    </Box>
  );
};

export default BusinessEvents;

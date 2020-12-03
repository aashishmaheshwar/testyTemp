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
// import HelpIcon from "@material-ui/icons/Help";
import { RuleModelValidationSchema } from "../configs/RuleModel";

const useStyles = makeStyles({
  ruleName: {
    marginBottom: "15px",
  },
});

const ruleTypes = [{ id: "REG", name: "Regular" }];

const Rules = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useStyles();
  const formik = useFormik({
    // initial values from API
    initialValues: {
      ruleId: "",
      ruleName: "",
      ruleType: null,
    },
    validationSchema: RuleModelValidationSchema,
    // validateOnBlur: false,
    onSubmit: (values) => {
      const {
        ruleType: { id: ruleType },
      } = values as any;
      let postData: any = { ...values, ruleType };
      if (isNew) {
        delete postData.ruleId;
      }
      alert(JSON.stringify(postData, null, 2));
    },
  });

  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew ? "Create new Rule" : "Show/Edit Rule"}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {!isNew && (
          <TextField
            margin="dense"
            label="Rule Id"
            InputLabelProps={{
              shrink: true,
            }}
            name="ruleId"
            fullWidth
            disabled
            value={formik.values.ruleId}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        )}
        <Autocomplete
          // id="combo-box-demo"
          fullWidth
          value={formik.values.ruleType as any}
          onChange={(event: any, newValue: any | null) => {
            formik.setFieldValue("ruleType", newValue);
          }}
          options={ruleTypes} // fetched asynchronously; maybe elastic search
          getOptionLabel={({ id, name }: { id: string; name: string }) =>
            `${id} : ${name}`
          }
          renderInput={(params: any) => (
            <TextField
              {...params}
              required
              label="Rule Type"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <br />
        <TextField
          autoFocus
          required
          margin="dense"
          label="Rule Name"
          InputLabelProps={{
            shrink: true,
          }}
          name="ruleName"
          fullWidth
          value={formik.values.ruleName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.ruleName && Boolean(formik.errors.ruleName)}
          helperText={formik.touched.ruleName && formik.errors.ruleName}
          className={classes.ruleName}
        />
        <br />
        {/* placeholder for adding rule attributes */}
        <Box>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Rules;

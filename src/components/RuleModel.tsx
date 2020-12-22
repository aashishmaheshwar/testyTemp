import React from "react";
import Box from "@material-ui/core/Box";
import { Formik, Form } from "formik";
import { Button, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  RuleInitialValues,
  RuleModelValidationSchema,
} from "../configs/RuleModel";
import RuleAttributeContainer from "./RuleAttributeContainer";
import { useRuleModelStyles } from "./RuleModelStyles";

const ruleTypes = [
  { id: "REG", name: "Regular" },
  { id: "ACC", name: "Account" },
];

const RuleModel = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useRuleModelStyles();

  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew ? "Create new Rule" : "Show/Edit Rule"}
      </Typography>
      <Formik
        initialValues={RuleInitialValues}
        validationSchema={RuleModelValidationSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          const {
            ruleType: { id: ruleType },
          } = values as any;
          let postData: any = { ...values, ruleType };
          if (isNew) {
            delete postData.ruleId;
          }
          postData.attributes = postData.attributes.map(
            ({ id, ...rest }: any) => rest
          );
          alert(JSON.stringify(postData, null, 2));
          resetForm();
          setSubmitting(false);
        }}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            isValid,
            setFieldValue,
            getFieldProps,
            isSubmitting,
          } = formikProps;

          return (
            <Form>
              {!isNew && (
                <TextField
                  margin="dense"
                  label="Rule Id"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  disabled
                  {...getFieldProps("ruleId")}
                />
              )}
              <Autocomplete
                // id="combo-box-demo"
                fullWidth
                value={values.ruleType as any}
                onChange={(event: any, newValue: any | null) => {
                  setFieldValue("ruleType", newValue);
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
                required
                margin="dense"
                label="Rule Name"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                {...getFieldProps("ruleName")}
                error={touched.ruleName && Boolean(errors.ruleName)}
                helperText={touched.ruleName && errors.ruleName}
                className={classes.ruleName}
              />
              <br />
              {/* placeholder for adding rule attributes */}
              <RuleAttributeContainer formikProps={formikProps} />
              <Box>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default RuleModel;

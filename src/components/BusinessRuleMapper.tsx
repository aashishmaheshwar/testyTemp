import { Box, TextField, Typography, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React from "react";
import { MockRuleIds, RuleTypes } from "../configs/RuleModel";
import { BusinessRuleMapperInitialValues } from "../configs/RuleMapper";
import RuleMapper from "./RuleMapper";

const BusinessRuleMapper = ({ isNew = false }: { isNew: boolean }) => {
  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew
          ? "Create new Business Event Rule"
          : "Show/Edit Business Event Rule"}
      </Typography>
      <Formik
        initialValues={BusinessRuleMapperInitialValues}
        // validationSchema={RuleModelValidationSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          const {
            ruleType: { id: ruleType },
          } = values as any;
          let postData: any = { ...values, ruleType };
          if (isNew) {
            delete postData.businessEventRuleId;
          }
          //   postData.attributes = postData.attributes.map(
          //     ({ id, ...rest }: any) => rest
          //   );
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
                  label="Business Event Rule Id"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  disabled
                  {...getFieldProps("businessEventRuleId")}
                />
              )}
              <Autocomplete
                fullWidth
                value={values.ruleType as any}
                onChange={(event: any, newValue: any | null) => {
                  setFieldValue("ruleType", newValue);
                  if (!newValue) {
                    setFieldValue("ruleId", newValue);
                    // reset the mapping as well
                  } else {
                    // trigger a GET call and get all ruleIds for this type /ruleIds?ruleType=<string> API
                  }
                }}
                options={RuleTypes} // fetched asynchronously; maybe elastic search
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
              <Autocomplete
                fullWidth
                value={values.ruleId as any}
                onChange={(event: any, newValue: any | null) => {
                  setFieldValue("ruleId", newValue);
                  // trigger a GET call and get the rule for this ruleId /rule?ruleId=<string> API
                  // setFieldValue("mapping", the array returned);
                }}
                options={MockRuleIds} // fetched asynchronously;
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    required
                    label="Rule Id"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
                disabled={!values.ruleType}
              />
              {values.mapping?.length && (
                <RuleMapper formikProps={formikProps} />
              )}
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

export default BusinessRuleMapper;

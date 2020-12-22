import { Box, TextField, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

const ruleTypes = [
  { id: "REG", name: "Regular" },
  { id: "ACC", name: "Account" },
];

const initialValues = {
  businessEventRuleId: "",
  ruleType: "",
  ruleId: "",
  // rule attributes for this rule ID is fetched and 'mapping' object must be built
  // mapping: {}
};

const BusinessRuleMapper = ({ isNew = false }: { isNew: boolean }) => {
  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew
          ? "Create new Business Event Rule"
          : "Show/Edit Business Event Rule"}
      </Typography>
      <Formik
        initialValues={initialValues}
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
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default BusinessRuleMapper;

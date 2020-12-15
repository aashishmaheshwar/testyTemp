import React from "react";
import Box from "@material-ui/core/Box";
import {
  Formik,
  Form,
  FieldArray,
  // Field,
  // FieldArray,
  // ErrorMessage,
  getIn,
} from "formik";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  // Input,
  // InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  // Tooltip,
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

const initialValues = {
  ruleId: "",
  ruleName: "",
  ruleType: null,
  attributes: [{ name: "", type: "", id: Math.random() }],
};

const Rules = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useStyles();

  return (
    <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew ? "Create new Rule" : "Show/Edit Rule"}
      </Typography>
      <Formik
        initialValues={initialValues}
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
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          isValid,
          setFieldValue,
          getFieldProps,
          isSubmitting,
        }) => (
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
            <h4>Attributes</h4>
            <FieldArray name="attributes">
              {({ push, remove }) => {
                return (
                  <>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                      {values.attributes.map((attribute, idx) => {
                        const name = `attributes[${idx}].name`;
                        const touchedName = getIn(touched, name);
                        const errorName = getIn(errors, name);

                        const type = `attributes[${idx}].type`;
                        const touchedType = getIn(touched, type);
                        const errorType = getIn(errors, type);

                        return (
                          <Box key={attribute.id} display="flex">
                            <TextField
                              margin="dense"
                              label="Name"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              // disabled
                              {...getFieldProps(name)}
                              error={!!(touchedName && errorName)}
                              helperText={touchedName && errorName}
                            />
                            <FormControl
                              error={Boolean(touchedType && errorType)}
                            >
                              <InputLabel shrink id={type}>
                                Type
                              </InputLabel>
                              <Select
                                labelId={type}
                                {...getFieldProps(type)}
                                // value={(values as any)[type]}
                                // onChange={(
                                //   event: any,
                                //   newValue: any | null
                                // ) => {
                                //   setFieldValue(type, newValue);
                                // }}
                              >
                                <MenuItem value={"ENUM"}>ENUM</MenuItem>
                                <MenuItem value={"CHAR"}>CHAR</MenuItem>
                                <MenuItem value={"DECIMAL"}>DECIMAL</MenuItem>
                                <MenuItem value={"DATE"}>DATE</MenuItem>
                                <MenuItem value={"TIME"}>TIME</MenuItem>
                                <MenuItem value={"DATETIME"}>DATETIME</MenuItem>
                              </Select>
                              {touchedType && errorType && (
                                <FormHelperText>{errorType}</FormHelperText>
                              )}
                            </FormControl>
                            <Button onClick={() => remove(idx)}>Remove</Button>
                          </Box>
                        );
                      })}
                    </Box>
                    {values.attributes.length === 0 && (
                      <FormHelperText error={Boolean(errors?.attributes)}>
                        {errors?.attributes}
                      </FormHelperText>
                    )}
                    <Button
                      onClick={() => push({ name: "", id: Math.random() })}
                    >
                      Add Attribute
                    </Button>
                  </>
                );
              }}
            </FieldArray>
            <Box>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Rules;

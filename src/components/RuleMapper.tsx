import React, { useEffect, useState } from "react";
import { FieldArray, getIn, FormikProps } from "formik";
import { BusinessRuleMapper, RuleAttributeMap } from "../configs/RuleMapper";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { useRuleMapperStyles } from "./RuleMapperStyles";
import { Autocomplete } from "@material-ui/lab";
import { TradeAttributes } from "../types/Trade";

type RuleMapperProps = {
  formikProps: FormikProps<BusinessRuleMapper>;
};

// options are based on the tradeId associated.
const options: Array<string> = [...TradeAttributes];

// standard functions - sample here
const functionOptions: Array<string> = [
  "COMM-Fn-MapSide",
  "COMM-Fn-Amount",
  "RefData-GetAccount",
];

const RuleMapper = ({ formikProps }: RuleMapperProps) => {
  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const classes = useRuleMapperStyles();

  return (
    <>
      <h4>Rule Mapping</h4>
      <FieldArray name="mapping">
        {({}) => {
          return (
            <>
              <Box className={classes.attributeWrapper}>
                {values.mapping.map((attribute, idx) => {
                  const attributeName = `mapping[${idx}].attributeName`;

                  const type = `mapping[${idx}].type`;
                  const touchedType = getIn(touched, type);
                  const errorType = getIn(errors, type);

                  const functionArgs = `mapping[${idx}].functionArgs`;
                  const touchedFunctionArgs = getIn(touched, functionArgs);
                  const errorFunctionArgs = getIn(errors, functionArgs);

                  const functionName = `mapping[${idx}].functionName`;
                  const touchedFunctionName = getIn(touched, functionName);
                  const errorFunctionName = getIn(errors, functionName);

                  const mappedTo = `mapping[${idx}].mappedTo`;
                  const touchedMappedTo = getIn(touched, mappedTo);
                  const errorMappedTo = getIn(errors, mappedTo);

                  const onAttributeTypeChange = (event: any) => {
                    const { value } = event.target;
                    switch (value) {
                      case "function":
                        setFieldValue(functionName, "");
                        setFieldValue(functionArgs, []);
                        setFieldValue(mappedTo, undefined);
                        break;
                      case "value":
                        setFieldValue(mappedTo, "");
                        setFieldValue(functionName, undefined);
                        setFieldValue(functionArgs, undefined);
                        break;
                    }
                    setFieldValue(type, value);
                  };

                  return (
                    <Box key={idx}>
                      <TextField
                        margin="dense"
                        label="Attribute Name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={getFieldProps(attributeName).value}
                      />
                      <FormControl error={Boolean(touchedType && errorType)}>
                        <InputLabel shrink id={type}>
                          Type
                        </InputLabel>
                        <Select
                          labelId={type}
                          {...getFieldProps(type)}
                          onChange={onAttributeTypeChange}
                        >
                          <MenuItem value={"function"}>Function</MenuItem>
                          <MenuItem value={"value"}>Value</MenuItem>
                        </Select>
                        {touchedType && errorType && (
                          <FormHelperText>{errorType}</FormHelperText>
                        )}
                      </FormControl>
                      {/* mappedTo */}
                      {getFieldProps(type).value === "value" && (
                        <Autocomplete
                          freeSolo
                          classes={{
                            root: `${classes.acRoot} ${classes.mappedToRoot}`,
                            input: classes.acInput,
                          }}
                          options={options}
                          {...getFieldProps(mappedTo)}
                          onInputChange={(e, value) => {
                            setFieldValue(mappedTo, value);
                          }}
                          onChange={(e, value) => {
                            setFieldValue(mappedTo, value || "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Mapped to Property"
                              margin="dense"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={Boolean(touchedMappedTo && errorMappedTo)}
                              helperText={touchedMappedTo && errorMappedTo}
                            />
                          )}
                        />
                      )}
                      {/* functionName and functionArgs */}
                      {getFieldProps(type).value === "function" && (
                        <>
                          <Autocomplete
                            freeSolo
                            classes={{
                              root: classes.acRoot,
                              input: classes.acInput,
                            }}
                            options={functionOptions}
                            {...getFieldProps(functionName)}
                            onInputChange={(e, value) => {
                              setFieldValue(functionName, value);
                            }}
                            onChange={(e, value) => {
                              setFieldValue(functionName, value || "");
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Function Name"
                                margin="dense"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                error={Boolean(
                                  touchedFunctionName && errorFunctionName
                                )}
                                helperText={
                                  touchedFunctionName && errorFunctionName
                                }
                              />
                            )}
                          />
                          <Autocomplete
                            freeSolo
                            multiple
                            classes={{
                              root: `${classes.acRoot} ${classes.argsRoot}`,
                              input: classes.acInput,
                            }}
                            options={options}
                            {...getFieldProps(functionArgs)}
                            onChange={(e, value) => {
                              setFieldValue(functionArgs, value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Function arguements"
                                margin="dense"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                error={Boolean(
                                  touchedFunctionArgs && errorFunctionArgs
                                )}
                                helperText={
                                  touchedFunctionArgs && errorFunctionArgs
                                }
                              />
                            )}
                          />
                        </>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </>
          );
        }}
      </FieldArray>
    </>
  );
};

export default RuleMapper;

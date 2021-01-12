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
} from "@material-ui/core";
import { useRuleModelStyles } from "./RuleModelStyles";

type RuleMapperProps = {
  formikProps: FormikProps<BusinessRuleMapper>;
};

const RuleMapper = ({ formikProps }: RuleMapperProps) => {
  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const classes = useRuleModelStyles();

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

                  const onAttributeTypeChange = (event: any) => {
                    const { value } = event.target;
                    switch (value) {
                      case "function":
                        // setFieldValue(vals, []);
                        break;
                      case "value":
                        // setFieldValue(length, "");
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
                      </FormControl>
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

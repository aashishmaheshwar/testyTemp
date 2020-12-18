import React, { useState } from "react";
import { FieldArray, getIn, FormikProps } from "formik";
import Box from "@material-ui/core/Box";
import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import { useRuleModelStyles } from "./RuleModelStyles";
import { RuleInitialValues } from "../configs/RuleModel";

const RuleAttributeContainer = ({
  formikProps,
}: {
  formikProps: FormikProps<typeof RuleInitialValues>;
}) => {
  const { values, errors, touched, getFieldProps, setFieldValue } = formikProps;
  const classes = useRuleModelStyles();
  const [chipInputVals, setChipInputVals] = useState<Array<string>>([]);

  return (
    <>
      <h4>Attributes</h4>
      <FieldArray name="attributes">
        {({ push, remove }) => {
          return (
            <>
              <Box className={classes.attributeWrapper}>
                {values.attributes.map((attribute, idx) => {
                  const name = `attributes[${idx}].name`;
                  const touchedName = getIn(touched, name);
                  const errorName = getIn(errors, name);

                  const type = `attributes[${idx}].type`;
                  const touchedType = getIn(touched, type);
                  const errorType = getIn(errors, type);

                  const vals = `attributes[${idx}].values`;
                  const touchedVals = getIn(touched, vals);
                  const errorVals = getIn(errors, vals);

                  const length = `attributes[${idx}].length`;
                  const touchedLength = getIn(touched, length);
                  const errorLength = getIn(errors, length);

                  const onAttributeTypeChange = (event: any) => {
                    const { value } = event.target;
                    switch (value) {
                      case "ENUM":
                        setFieldValue(vals, []);
                        break;
                    }
                    setFieldValue(type, value);
                  };

                  const chipInputOnKeyPress = (e: any) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      e.preventDefault();
                      let newVals = Array.from(
                        new Set([
                          ...getFieldProps(vals).value,
                          chipInputVals[idx],
                        ])
                      ).sort();
                      setFieldValue(vals, newVals);
                      setChipInputVals((oldArr) => {
                        const newArr = [...oldArr];
                        newArr[idx] = "";
                        return newArr;
                      });
                    }
                  };

                  const chipInputOnChange = (e: any) => {
                    setChipInputVals((oldVals) => {
                      const newVals = [...oldVals];
                      newVals[idx] = e.target.value.trim();
                      return newVals;
                    });
                  };

                  const handleChipDelete = (value: string) => () => {
                    const valuesSet = new Set([...getFieldProps(vals).value]);
                    valuesSet.delete(value);
                    let newVals = Array.from(valuesSet).sort();
                    setFieldValue(vals, newVals);
                  };

                  return (
                    <Box key={attribute.id}>
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
                      <FormControl error={Boolean(touchedType && errorType)}>
                        <InputLabel shrink id={type}>
                          Type
                        </InputLabel>
                        <Select
                          labelId={type}
                          {...getFieldProps(type)}
                          onChange={onAttributeTypeChange}
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
                      {getFieldProps(type).value === "ENUM" && (
                        <Paper component="ul" className={classes.valuesRoot}>
                          {getFieldProps(vals).value.map((attr: string) => (
                            <li key={attr}>
                              {/* render chips here */}
                              <Chip
                                label={attr}
                                onDelete={handleChipDelete(attr)}
                                className={classes.chip}
                              />
                            </li>
                          ))}
                          {/* render input here */}
                          <li>
                            <Input
                              classes={{
                                root: classes.attributeInputBlur,
                                focused: classes.attributeInputFocus,
                              }}
                              onKeyPress={chipInputOnKeyPress}
                              value={chipInputVals[idx]}
                              onChange={chipInputOnChange}
                            />
                          </li>
                        </Paper>
                      )}
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
                onClick={() => push({ name: "", type: "", id: Math.random() })}
              >
                Add Attribute
              </Button>
            </>
          );
        }}
      </FieldArray>
    </>
  );
};

export default RuleAttributeContainer;

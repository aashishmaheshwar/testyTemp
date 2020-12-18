import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import {
  Formik,
  Form,
  FieldArray,
  // Field,
  // FieldArray,
  // ErrorMessage,
  getIn,
  FormikProps,
} from "formik";
import {
  Button,
  Chip,
  createStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  // Input,
  // InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  // Tooltip,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import HelpIcon from "@material-ui/icons/Help";
import { RuleModelValidationSchema } from "../configs/RuleModel";
import RuleAttributeContainer from "./RuleAttributeContainer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ruleName: {
      marginBottom: "15px",
    },
    attributeWrapper: {
      display: "flex",
      flexDirection: "column",
      rowGap: "15px",
      "& > div": {
        display: "flex",
        "& > ul": {
          flex: 4,
        },
        "& > div": {
          "&.MuiFormControl-root": {
            flex: 1,
          },
          "&.MuiTextField-root": {
            flex: 3,
            margin: "3px 10px 0 0",
          },
          marginRight: "10px",
          "& .MuiSelect-root": {
            textAlign: "left",
          },
        },
      },
    },
    valuesRoot: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
      maxWidth: "300px",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    attributeInputBlur: {
      opacity: 0.3,
    },
    attributeInputFocus: {
      opacity: 1,
    },
  })
);

const ruleTypes = [{ id: "REG", name: "Regular" }];

const initialValues = {
  ruleId: "",
  ruleName: "",
  ruleType: null,
  attributes: [{ name: "", type: "", id: Math.random() }],
};

const Rules = ({ isNew = false }: { isNew: boolean }) => {
  const classes = useStyles();
  // const [chipInputVals, setChipInputVals] = useState<Array<string>>([]);

  // const buildAttributeContainer = (
  //   formikProps: FormikProps<typeof initialValues>
  // ) => {
  //   const {
  //     values,
  //     errors,
  //     touched,
  //     getFieldProps,
  //     setFieldValue,
  //   } = formikProps;

  //   return (
  //     <>
  //       <h4>Attributes</h4>
  //       <FieldArray name="attributes">
  //         {({ push, remove }) => {
  //           return (
  //             <>
  //               <Box className={classes.attributeWrapper}>
  //                 {values.attributes.map((attribute, idx) => {
  //                   const name = `attributes[${idx}].name`;
  //                   const touchedName = getIn(touched, name);
  //                   const errorName = getIn(errors, name);

  //                   const type = `attributes[${idx}].type`;
  //                   const touchedType = getIn(touched, type);
  //                   const errorType = getIn(errors, type);

  //                   const vals = `attributes[${idx}].values`;
  //                   const touchedVals = getIn(touched, vals);
  //                   const errorVals = getIn(errors, vals);

  //                   const length = `attributes[${idx}].length`;
  //                   const touchedLength = getIn(touched, length);
  //                   const errorLength = getIn(errors, length);

  //                   const onAttributeTypeChange = (event: any) => {
  //                     const { value } = event.target;
  //                     switch (value) {
  //                       case "ENUM":
  //                         setFieldValue(vals, []);
  //                         break;
  //                     }
  //                     setFieldValue(type, value);
  //                   };

  //                   const chipInputOnKeyPress = (e: any) => {
  //                     if (e.key === "Enter" || e.keyCode === 13) {
  //                       e.preventDefault();
  //                       let newVals = Array.from(
  //                         new Set([
  //                           ...getFieldProps(vals).value,
  //                           chipInputVals[idx],
  //                         ])
  //                       ).sort();
  //                       setFieldValue(vals, newVals);
  //                       setChipInputVals((oldArr) => {
  //                         const newArr = [...oldArr];
  //                         newArr[idx] = "";
  //                         return newArr;
  //                       });
  //                     }
  //                   };

  //                   const chipInputOnChange = (e: any) => {
  //                     setChipInputVals((oldVals) => {
  //                       const newVals = [...oldVals];
  //                       newVals[idx] = e.target.value.trim();
  //                       return newVals;
  //                     });
  //                   };

  //                   const handleChipDelete = (value: string) => () => {
  //                     const valuesSet = new Set([...getFieldProps(vals).value]);
  //                     valuesSet.delete(value);
  //                     let newVals = Array.from(valuesSet).sort();
  //                     setFieldValue(vals, newVals);
  //                   };

  //                   return (
  //                     <Box key={attribute.id}>
  //                       <TextField
  //                         margin="dense"
  //                         label="Name"
  //                         InputLabelProps={{
  //                           shrink: true,
  //                         }}
  //                         // disabled
  //                         {...getFieldProps(name)}
  //                         error={!!(touchedName && errorName)}
  //                         helperText={touchedName && errorName}
  //                       />
  //                       <FormControl error={Boolean(touchedType && errorType)}>
  //                         <InputLabel shrink id={type}>
  //                           Type
  //                         </InputLabel>
  //                         <Select
  //                           labelId={type}
  //                           {...getFieldProps(type)}
  //                           onChange={onAttributeTypeChange}
  //                         >
  //                           <MenuItem value={"ENUM"}>ENUM</MenuItem>
  //                           <MenuItem value={"CHAR"}>CHAR</MenuItem>
  //                           <MenuItem value={"DECIMAL"}>DECIMAL</MenuItem>
  //                           <MenuItem value={"DATE"}>DATE</MenuItem>
  //                           <MenuItem value={"TIME"}>TIME</MenuItem>
  //                           <MenuItem value={"DATETIME"}>DATETIME</MenuItem>
  //                         </Select>
  //                         {touchedType && errorType && (
  //                           <FormHelperText>{errorType}</FormHelperText>
  //                         )}
  //                       </FormControl>
  //                       {getFieldProps(type).value === "ENUM" && (
  //                         <Paper component="ul" className={classes.valuesRoot}>
  //                           {getFieldProps(vals).value.map((attr: string) => (
  //                             <li key={attr}>
  //                               {/* render chips here */}
  //                               <Chip
  //                                 label={attr}
  //                                 onDelete={handleChipDelete(attr)}
  //                                 className={classes.chip}
  //                               />
  //                             </li>
  //                           ))}
  //                           {/* render input here */}
  //                           <li>
  //                             <Input
  //                               classes={{
  //                                 root: classes.attributeInputBlur,
  //                                 focused: classes.attributeInputFocus,
  //                               }}
  //                               onKeyPress={chipInputOnKeyPress}
  //                               value={chipInputVals[idx]}
  //                               onChange={chipInputOnChange}
  //                             />
  //                           </li>
  //                         </Paper>
  //                       )}
  //                       <Button onClick={() => remove(idx)}>Remove</Button>
  //                     </Box>
  //                   );
  //                 })}
  //               </Box>
  //               {values.attributes.length === 0 && (
  //                 <FormHelperText error={Boolean(errors?.attributes)}>
  //                   {errors?.attributes}
  //                 </FormHelperText>
  //               )}
  //               <Button
  //                 onClick={() =>
  //                   push({ name: "", type: "", id: Math.random() })
  //                 }
  //               >
  //                 Add Attribute
  //               </Button>
  //             </>
  //           );
  //         }}
  //       </FieldArray>
  //     </>
  //   );
  // };

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
              {/* {buildAttributeContainer(formikProps)} */}
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

export default Rules;

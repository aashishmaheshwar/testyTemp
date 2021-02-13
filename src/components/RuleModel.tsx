import React from "react";
import Box from "@material-ui/core/Box";
import { Formik, Form } from "formik";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  RuleInitialValues,
  RuleModelValidationSchema,
  RuleTypes,
} from "../configs/RuleModel";
import RuleAttributeContainer from "./RuleAttributeContainer";
import { useRuleModelStyles } from "./RuleModelStyles";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { env } from "../core/Environment";
import axios from "axios";
import { getRuleTypes } from "./Rules";

const createRuleModel = async (value: typeof RuleInitialValues) => {
  const { data } = await axios.post(
    env.apiHostName + env.apis.createRuleModel,
    value
  );
  return data;
};

const updateRuleModel = async (value: typeof RuleInitialValues) => {
  const { data } = await axios.put(
    env.apiHostName + env.apis.createRuleModel,
    value
  );
  return data;
};

type RuleModelProps = {
  isNew?: boolean;
  open?: boolean;
  event?: any;
  onClose: any;
};

const RuleModel = ({
  isNew = false,
  open = false,
  onClose,
  event,
}: RuleModelProps) => {
  const classes = useRuleModelStyles();
  const queryClient = useQueryClient();
  const { data: ruleTypes, isFetching: isRuleTypesFetching } = useQuery(
    "ruleTypes",
    getRuleTypes
  );
  // Mutations
  const createRuleModelMutation = useMutation(createRuleModel, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("ruleModels");
    },
  });
  const updateRuleModelMutation = useMutation(updateRuleModel, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("ruleModels");
    },
  });

  const updateRuleObj = (event: any): any => {
    return {
      ...event,
      ruleType: {
        ...((ruleTypes as Array<{ id: string; name: string }>) || []).find(
          ({ id }) => id === event.ruleType
        ),
      },
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="rule-details-dialog"
      maxWidth="lg"
    >
      <DialogTitle id="rule-details-dialog">
        {isNew ? "Create new Rule" : "Show/Edit Rule"}
      </DialogTitle>
      {isRuleTypesFetching ? (
        <Box
          width="400px"
          height="200px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Fetching Rule Types
        </Box>
      ) : (
        <Formik
          initialValues={
            isNew ? RuleInitialValues : updateRuleObj({ ...event })
          }
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
              ({ id, ...rest }: any) => {
                if (!rest.length) {
                  rest.length = "";
                }
                if (!rest.values) {
                  rest.values = [];
                }
                return rest;
              }
            );
            // alert(JSON.stringify(postData, null, 2));
            if (isNew) createRuleModelMutation.mutate(postData);
            else updateRuleModelMutation.mutate(postData);
            resetForm();
            setSubmitting(false);
            onClose();
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
                <DialogContent>
                  <DialogContentText>
                    {isNew
                      ? `To create a new rule enter the below information.`
                      : `Update details to modify an existing rule`}
                  </DialogContentText>
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
                    options={
                      isRuleTypesFetching
                        ? []
                        : (ruleTypes as Array<{ id: string; name: string }>)
                    } // fetched asynchronously; maybe elastic search
                    getOptionLabel={({
                      id,
                      name,
                    }: {
                      id: string;
                      name: string;
                    }) => `${id} : ${name}`}
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
                    <Button
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Box>
                </DialogContent>
              </Form>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};

export default RuleModel;

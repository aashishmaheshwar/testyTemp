import {
  Box,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
} from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { useState } from "react";
// import { MockRuleIds, RuleTypes } from "../configs/RuleModel";
import {
  BusinessRuleMapperInitialValues,
  RuleMapperValidationSchema,
} from "../configs/RuleMapper";
import RuleMapper from "./RuleMapper";
import { env } from "../core/Environment";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getRuleIdsForRuleType,
  getRuleModelForRuleId,
  getRuleTypes,
} from "./Rules";
import { getTradeModelForId } from "./Trades";

export const createBusinessEventRule = async (body: any) => {
  const { data } = await axios.post(
    `${env.apiHostName}/${env.apis.createBusinessEventRule}`,
    body
  );
  return data;
};

export const updateBusinessEventRule = async (body: any) => {
  const { data } = await axios.put(
    `${env.apiHostName}/${env.apis.updateBusinessEventRule}`,
    body
  );
  return data;
};

const updateBusinessRuleMapper = (event: any, ruleTypes: any): any => {
  return {
    ...event,
    mapping: event.mapping.map((obj: any) => {
      const newObj = { ...obj };
      if (newObj.type === "function") {
        newObj.functionArgs = [...obj.properties];
      } else {
        newObj.mappedTo = obj?.properties[0];
      }
      delete newObj.properties;
      return newObj;
    }),
    ruleType: {
      ...ruleTypes.find(({ id }: any) => id === event.ruleType),
    },
  };
};

type BusinessRuleProps = {
  isNew?: boolean;
  open?: boolean;
  event?: any;
  businessEventId: string | null;
  tradeModelId: string | null;
  onClose: any;
};

const BusinessRuleMapper = ({
  isNew = false,
  open = false,
  event,
  onClose,
  businessEventId,
  tradeModelId,
}: BusinessRuleProps) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [ruleIds, setRuleIds] = useState([]);
  const queryClient = useQueryClient();
  const { data: ruleTypes, isFetching: isRuleTypesFetching } = useQuery(
    "ruleTypes",
    getRuleTypes
  );
  const { data: tradeModel, isFetching: isTradeModelFetching } = useQuery(
    `tradeModel-${tradeModelId}`,
    getTradeModelForId(tradeModelId as string)
  );
  // Mutations
  const businessEventMutation = useMutation(createBusinessEventRule, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("businessEventRules");
      setAlertMsg("Saved successfully");
    },
    onError: (error) => {
      setAlertMsg((error as any).message);
    },
  });

  const updateBusinessEventMutation = useMutation(updateBusinessEventRule, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("businessEventRules");
      setAlertMsg("Saved successfully");
    },
    onError: (error) => {
      setAlertMsg((error as any).message);
    },
  });

  const handleAlertClose = () => {
    if (alertMsg === "Saved successfully") {
      onClose();
    }
    setAlertMsg("");
  };

  return (
    <>
      <Snackbar
        open={!!alertMsg}
        autoHideDuration={2000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertMsg.includes("success") ? "success" : "error"}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="business-event-rule-details-dialog"
        maxWidth="lg"
      >
        <DialogTitle id="business-event-rule-details-dialog">
          {isNew
            ? "Create new Business Event Rule"
            : "Show/Edit Business Event Rule"}
        </DialogTitle>
        {/* <Box width="80%" margin="auto">
      <Typography variant="h6" component="h6">
        {isNew
          ? "Create new Business Event Rule"
          : "Show/Edit Business Event Rule"}
      </Typography> */}
        {isRuleTypesFetching ? (
          "fetching rule types"
        ) : (
          <Formik
            initialValues={
              isNew
                ? BusinessRuleMapperInitialValues
                : updateBusinessRuleMapper({ ...event }, ruleTypes)
            }
            validationSchema={RuleMapperValidationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              setSubmitting(true);
              const {
                ruleType: { id: ruleType },
              } = values as any;
              const mapping = values.mapping.map((obj: any) => {
                const newObj = { ...obj };
                if (newObj.type === "function") {
                  newObj.properties = [...obj.functionArgs];
                  delete newObj.functionArgs;
                } else {
                  newObj.properties = [obj.mappedTo];
                  delete newObj.mappedTo;
                }
                return newObj;
              });
              let postData: any = { ...values, mapping, ruleType };
              if (isNew) {
                delete postData.businessEventRuleId;
              }
              //   postData.attributes = postData.attributes.map(
              //     ({ id, ...rest }: any) => rest
              //   );
              postData.businessEventId = businessEventId;
              alert(JSON.stringify(postData, null, 2));
              if (isNew) {
                businessEventMutation.mutate(postData);
              } else {
                updateBusinessEventMutation.mutate(postData);
              }
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
                        ? `To create a new business event rule enter the below information.`
                        : `Update details to modify an existing business event rule`}
                    </DialogContentText>
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
                      onChange={async (event: any, newValue: any | null) => {
                        setFieldValue("ruleType", newValue);
                        if (!newValue) {
                          setFieldValue("ruleId", "");
                          setRuleIds([]);
                          // reset the mapping as well
                        } else {
                          const ruleIdsForType = await getRuleIdsForRuleType(
                            newValue.id
                          );
                          setRuleIds(ruleIdsForType);
                          // trigger a GET call and get all ruleIds for this type /ruleIds?ruleType=<string> API
                        }
                      }}
                      options={ruleTypes || []} // fetched asynchronously; maybe elastic search
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
                    <Autocomplete
                      fullWidth
                      value={values.ruleId as any}
                      onChange={async (event: any, newValue: any | null) => {
                        setFieldValue("ruleId", newValue);
                        const ruleModel = await getRuleModelForRuleId(newValue);
                        console.log(ruleModel);
                        const mapping = ruleModel.attributes.map(
                          ({ name }: any) => ({ attributeName: name })
                        );
                        // trigger a GET call and get the rule for this ruleId /rule?ruleId=<string> API
                        setFieldValue("mapping", mapping);
                      }}
                      options={ruleIds} // fetched asynchronously;
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
                      disabled={!values.ruleType && ruleIds.length === 0}
                    />
                    {getFieldProps("ruleId").value &&
                      values.mapping?.length && (
                        <RuleMapper
                          formikProps={formikProps}
                          options={tradeModel.attributes || []}
                        />
                      )}
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
    </>
  );
};

export default BusinessRuleMapper;

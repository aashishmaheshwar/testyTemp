import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useFormik } from "formik";
import RuleQueryBuilder from "../core/components/QueryBuilder";
import BusinessEventTriggerConfig from "../configs/BusinessEventTriggerConfig";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  makeStyles,
  TextField,
  Tooltip,
  Snackbar,
} from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import HelpIcon from "@material-ui/icons/Help";
import { BusinessEventValidationSchema } from "../configs/BusinessEvent";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { env } from "../core/Environment";
import axios from "axios";
import { getTradeModels } from "./Trades";
import { Trade } from "../types/Trade";

const createBusinessEvent = async (value: any) => {
  const { data } = await axios.post(
    `${env.apiHostName}/${env.apis.createBusinessEvent}`,
    value
  );
  return data;
};

const updateBusinessEvent = async (value: any) => {
  const { data } = await axios.put(
    `${env.apiHostName}/${env.apis.updateBusinessEvent}`,
    value
  );
  return data;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "5px",
    margin: 0,
    marginTop: "8px",
  },
  chip: {
    margin: "2px",
  },
  attributeLabel: {
    paddingTop: "8px",
    display: "flex",
    alignItems: "center",
  },
  attributeInputBlur: {
    opacity: 0.3,
  },
  attributeInputFocus: {
    opacity: 1,
  },
  triggerConditionLabel: {
    textAlign: "start",
  },
  businessEventName: {
    marginBottom: "15px",
  },
});

// const tradeModels = [
//   { id: "TM000027", name: "XP Investments - Equity" },
//   { id: "TM000028", name: "XP Investments - Real Estate" },
// ];

const buildTriggerConfig = (tradeModel: any) => {
  // based on attributes, build this
  const triggerConfig = ((tradeModel.attributes as Array<string>) || []).reduce(
    (acc: any, item: any) => {
      if ((BusinessEventTriggerConfig.fields as any)[item]) {
        acc[item] = { ...(BusinessEventTriggerConfig.fields as any)[item] };
      } else {
        if (item.toLowerCase().endsWith("dt")) {
          acc[item] = {
            label: item,
            type: "date",
          };
        } else if (item.toLowerCase().endsWith("tm")) {
          acc[item] = {
            label: item,
            type: "time",
          };
        } else if (item.toLowerCase().endsWith("qty")) {
          acc[item] = {
            label: item,
            type: "number",
            preferWidgets: ["number"],
            fieldSettings: {
              min: 0,
            },
          };
        } else {
          acc[item] = {
            label: item,
            type: "text",
          };
        }
      }
      return acc;
    },
    {}
  );
  return {
    fields: triggerConfig,
  };
  // return BusinessEventTriggerConfig;
};

const updateTradeModelObj = (
  event: any,
  tradeModels: Array<{ id: string; name: string }>
): any => {
  return {
    ...event,
    tradeModelId: {
      ...tradeModels.find(({ id }) => id === event.tradeModelId),
    },
  };
};

type BusinessEventProps = {
  isNew?: boolean;
  open?: boolean;
  event?: any;
  onClose: any;
};

const BusinessEvent = ({
  isNew = false,
  open = false,
  event,
  onClose,
}: BusinessEventProps) => {
  const [alertMsg, setAlertMsg] = useState("");
  const classes = useStyles();
  const history = useHistory();
  const queryClient = useQueryClient();
  // Mutations
  const businessEventMutation = useMutation(createBusinessEvent, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("businessEvents"); // later
      setAlertMsg("Saved successfully");
    },
    onError: (error) => {
      setAlertMsg((error as any).message);
    },
  });
  const updateBusinessEventMutation = useMutation(updateBusinessEvent, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("businessEvents"); // later
      setAlertMsg("Saved successfully");
    },
    onError: (error) => {
      setAlertMsg((error as any).message);
    },
  });
  const [tradeModels, setTradeModels] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const {
    // data,
    error: tradeModelsFetchError,
    isFetching: tradeModelsIsFetching,
  } = useQuery("tradeModels", getTradeModels, {
    refetchInterval: false,
    onSuccess: (data: Array<Trade>) => {
      const modelData = data.map(
        ({ tradeModelId, tradeModelName, attributes }) => ({
          id: tradeModelId,
          name: tradeModelName,
          attributes,
        })
      );
      setTradeModels(modelData);
    },
  });
  const formik = useFormik({
    // initial values from API
    initialValues: isNew
      ? {
          businessEventId: "",
          businessEventName: "",
          tradeModelId: null,
          triggerCondition: "",
        }
      : updateTradeModelObj(
          { ...event },
          tradeModelsIsFetching ? [] : tradeModels
        ),
    validationSchema: BusinessEventValidationSchema,
    // validateOnBlur: false,
    onSubmit: (values) => {
      const {
        tradeModelId: { id: tradeModelId },
      } = values as any;
      let postData: any = {
        ...values,
        tradeModelId,
        triggerCondition: JSON.stringify(values.triggerCondition),
      };
      if (isNew) {
        delete postData.businessEventId;
      }
      alert(JSON.stringify(postData, null, 2));
      if (isNew) {
        businessEventMutation.mutate(postData);
      } else {
        // until update API implementation
        updateBusinessEventMutation.mutate(postData);
        onClose();
      }
      // history.push("/businessRuleMapper");
      // onClose();
    },
  });

  useEffect(() => {
    if (tradeModels.length > 0) {
      const initialFormData = updateTradeModelObj({ ...event }, tradeModels);
      formik.setFieldValue("tradeModelId", initialFormData.tradeModelId);
    }
  }, [event, tradeModels]);

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
        aria-labelledby="business-event-details-dialog"
        maxWidth="lg"
      >
        <DialogTitle id="business-event-details-dialog">
          {isNew ? "Create new Business Event" : "Show/Edit Business Event"}
        </DialogTitle>
        {tradeModelsIsFetching ? (
          <DialogContent>
            <Box
              width="400px"
              height="200px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              Fetching Trade Models
            </Box>
          </DialogContent>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <DialogContentText>
                {isNew
                  ? `To create a new business Event enter the below information.`
                  : `Update details to modify an existing business Event`}
              </DialogContentText>
              {!isNew && (
                <TextField
                  margin="dense"
                  label="Business Event Id"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="businessEventId"
                  fullWidth
                  disabled
                  value={formik.values.businessEventId}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              )}
              <TextField
                autoFocus
                required
                margin="dense"
                label="Business Event Name"
                InputLabelProps={{
                  shrink: true,
                }}
                name="businessEventName"
                fullWidth
                value={formik.values.businessEventName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.businessEventName &&
                  Boolean(formik.errors.businessEventName)
                }
                helperText={
                  formik.touched.businessEventName &&
                  formik.errors.businessEventName
                }
                className={classes.businessEventName}
              />
              {/* trade model id drop down */}
              <Autocomplete
                // id="combo-box-demo"
                fullWidth
                value={formik.values.tradeModelId as any}
                onChange={(event: any, newValue: any | null) => {
                  formik.setFieldValue("tradeModelId", newValue);
                }}
                placeholder="Select a Trade Model"
                options={tradeModels} // fetched asynchronously; maybe elastic search
                getOptionLabel={({ id, name }: { id: string; name: string }) =>
                  id ? `${id} : ${name}` : ""
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    required
                    label="Trade Model Id"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
              <br />
              <InputLabel
                required
                shrink={true}
                htmlFor="businessEventTriggerCondition"
                classes={{
                  root: classes.triggerConditionLabel,
                }}
              >
                Configure Rules&nbsp;
                <Tooltip title="Add rules to create a trigger condition">
                  <HelpIcon />
                </Tooltip>
                &nbsp;
              </InputLabel>
              {formik.values.tradeModelId?.attributes ? (
                <RuleQueryBuilder
                  buildConfig={buildTriggerConfig(formik.values.tradeModelId)}
                  condition={formik.values.triggerCondition} // renders only once
                  onTriggerCondition={(e: string) => {
                    !formik.touched.triggerCondition &&
                      (formik.values.triggerCondition || e) &&
                      formik.setFieldTouched("triggerCondition", true);
                    if (e) {
                      formik.setFieldError("triggerCondition", "");
                    }
                    formik.setFieldValue("triggerCondition", e);
                  }}
                />
              ) : null}
              <TextField
                margin="dense"
                required
                disabled
                multiline
                label="Trigger Condition"
                InputLabelProps={{
                  shrink: true,
                }}
                name="triggerCondition"
                id="businessEventTriggerCondition"
                fullWidth
                value={JSON.stringify(formik.values.triggerCondition, null, 2)}
                error={
                  formik.touched.triggerCondition &&
                  Boolean(formik.errors.triggerCondition)
                }
                helperText={
                  formik.touched.triggerCondition &&
                  formik.errors.triggerCondition
                }
                // disabled={!formik.errors.triggerCondition}
              />
              <Box>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </Box>
            </DialogContent>
          </form>
        )}
      </Dialog>
    </>
  );
};

export default BusinessEvent;

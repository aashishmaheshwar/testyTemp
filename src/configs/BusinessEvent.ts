import * as yup from "yup";

export const BusinessEventValidationSchema = yup.object().shape({
    businessEventName: yup.string().required("Business Event Name is required"),
    tradeModelId: yup.string().required("Trade Model Id is required"),
    triggerCondition: yup.string().required("Trigger Condition is required")
});
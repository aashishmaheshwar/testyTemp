import * as yup from "yup";

export const RuleModelValidationSchema = yup.object().shape({
    ruleName: yup.string().required("Rule Name is required"),
    ruleType: yup.string().required("Rule Type is required")
    // triggerCondition: yup.string().required("Trigger Condition is required")
});
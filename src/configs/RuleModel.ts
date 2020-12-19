import * as yup from "yup";

export const RuleModelValidationSchema = yup.object().shape({
    ruleName: yup.string().required("Rule Name is required"),
    ruleType: yup.string().required("Rule Type is required"),
    attributes: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Attribute name is required'),
            type: yup.string().required('Type is required').oneOf(['ENUM', 'CHAR', 'DECIMAL', 'DATE', 'TIME', 'DATETIME']),
            values: yup.array().of(yup.string()).min(1, 'Atleast one value is needed')
        })
    ).min(1, 'Atleast one attribute is needed')
    // triggerCondition: yup.string().required("Trigger Condition is required")
    // .required('Attributes are required')
});

export const RuleInitialValues = {
    ruleId: "",
    ruleName: "",
    ruleType: null,
    attributes: [{ name: "", type: "", id: Math.random() }],
  };
  
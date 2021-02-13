import * as yup from "yup";

export const RuleModelValidationSchema = yup.object().shape({
  ruleName: yup.string().required("Rule Name is required"),
  ruleType: yup.string().required("Rule Type is required"),
  attributes: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Attribute name is required"),
        type: yup
          .string()
          .required("Type is required")
          .oneOf(["ENUM", "CHAR", "DECIMAL", "DATE", "TIME", "DATETIME"]),
        values: yup
          .array()
          .of(yup.string())
          .min(1, "Atleast one value is needed"),
        length: yup
          .string()
          .when("type", {
            is: (val) => val === "CHAR",
            then: yup
              .string()
              .required("Length is required")
              .matches(/^[0-9]+$/, "Enter a valid length"),
          })
          .when("type", {
            is: (val) => val === "DECIMAL",
            then: yup
              .string()
              .required("Length is required")
              .matches(
                /^[0-9]+(,[0-9]+)?$/,
                "Decimal length should be integer or <DigitCountWhole>,<DigitCountFractional>"
              ),
          }),
      })
    )
    .min(1, "Atleast one attribute is needed"),
});

export const RuleInitialValues = {
  ruleId: "",
  ruleName: "",
  ruleType: null,
  attributes: [{ name: "", type: "", id: Math.random() }],
};

export const RuleTypes = [
  { id: "REG", name: "Regular" },
  { id: "ACC", name: "Account" },
];

export const MockRuleIds = ["R00001733", "R00001734", "R00001735"];

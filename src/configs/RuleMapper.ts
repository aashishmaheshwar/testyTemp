import * as yup from "yup";
interface AttributeBase {
  attributeName: string;
}

interface FunctionType extends AttributeBase {
  type: "function";
  functionName: string;
  functionArgs: Array<string>;
}

interface ValueType extends AttributeBase {
  type: "value";
  mappedTo: string;
}

export type RuleAttributeMap = FunctionType | ValueType | AttributeBase;

export type BusinessRuleMapper = {
  businessEventRuleId: string;
  ruleType: string | null;
  ruleId: string | null;
  mapping: Array<RuleAttributeMap>;
};

export const BusinessRuleMapperInitialValues: BusinessRuleMapper = {
  businessEventRuleId: "",
  ruleType: null,
  ruleId: null,
  // rule attributes for this rule ID is fetched and 'mapping' object must be built
  // dummy values for now to simulate a fetch
  mapping: [
    {
      attributeName: "abc",
    },
    {
      attributeName: "testFunc",
      type: "function",
      functionName: "translFunc",
      functionArgs: ["val1", "val2"],
    },
    {
      attributeName: "testVal",
      type: "value",
      mappedTo: "val3",
    },
  ],
};

export const RuleMapperValidationSchema = yup.object().shape({
  businessEventRuleId: yup.string(),
  ruleType: yup.string().required("Rule Type is required"),
  ruleId: yup.string().required("Rule Id is required"),
  mapping: yup
    .array()
    .of(
      yup.object().shape({
        attributeName: yup.string().required("Attribute name is required"),
        type: yup
          .string()
          .required("Type is required")
          .oneOf(["function", "value"]),
        mappedTo: yup.string().when("type", {
          is: (val) => val === "value",
          then: yup.string().required("Attribute to value map is required"),
        }),
        functionName: yup.string().when("type", {
          is: (val) => val === "function",
          then: yup.string().required("Function Name is required"),
        }),
        functionArgs: yup
          .array()
          .of(yup.string())
          .when("type", {
            is: (val) => val === "function",
            then: yup
              .array()
              .of(yup.string())
              .min(1, "Atleast one function argument is needed"),
          }),
      })
    )
    .min(1, "Atleast one attribute must be present and mapped in a rule"),
});

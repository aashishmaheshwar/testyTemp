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

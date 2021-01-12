import React, { useEffect, useState } from "react";
import { FieldArray, getIn, FormikProps } from "formik";
import { BusinessRuleMapper, RuleAttributeMap } from "../configs/RuleMapper";

type RuleMapperProps = {
  ruleId: string;
  formikProps: FormikProps<BusinessRuleMapper>;
  mappedData?: Array<RuleAttributeMap>;
};

const RuleMapper = ({ ruleId, mappedData, formikProps }: RuleMapperProps) => {
  const [data, setData] = useState<Array<RuleAttributeMap>>([
    // for testing
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
  ]);

  useEffect(() => {
    // fetch the rule attributes here and transform it and setData here
  }, [ruleId]);

  return <div>{data.map((attr, idx) => {})}</div>;
};

export default RuleMapper;

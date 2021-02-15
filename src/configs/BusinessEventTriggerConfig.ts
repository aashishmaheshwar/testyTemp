const BusinessEventTriggerConfig = {
  fields: {
    TxnTM: {
      label: "TxnTM",
      type: "time",
    },
    TrdDt: {
      label: "TrdDt",
      type: "date",
      // valueFormat: "YYYY-MM-DD",
    },
    CumQty: {
      label: "CumQty",
      type: "number",
      preferWidgets: ["number"],
      fieldSettings: {
        min: 0,
      },
    },
    LeavesQty: {
      label: "LeavesQty",
      type: "number",
      preferWidgets: ["number"],
      fieldSettings: {
        min: 0,
      },
    },
    LastMkt: {
      label: "LastMkt",
      type: "text",
    },
    LastPX: {
      label: "LastPX",
      type: "number",
    },
    LastQty: {
      label: "LastQty",
      type: "number",
      preferWidgets: ["number"],
      fieldSettings: {
        min: 0,
      },
    },
    // ExecTyp: {
    //   label: "ExecTyp",
    //   type: "select",
    //   valueSources: ["value"],
    //   fieldSettings: {
    //     listValues: [
    //       { value: "F", title: "Fix" },
    //       { value: "S", title: "SIP" },
    //     ],
    //     // allowCustomValues: true
    //   }
    // }
  },
};

export default BusinessEventTriggerConfig;

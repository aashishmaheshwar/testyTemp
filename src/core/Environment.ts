export const env = {
  apiHostName: "http://35.236.11.207:8080",
  apis: {
    //trade model
    getAttributes: "model-design/api/v1/readXml", // post call
    getTradeModels: "model-design/api/v1/tradeModel", // get call
    updateTradeModel: "model-design/api/v1/tradeModel", // put call
    createTradeModel: "model-design/api/v1/tradeModel", // post call

    //rule model
    getRuleTypes: "model-design/api/v1/rule/types", // get call
    getRuleIdsForRuleType: "model-design/api/v1/rule/ids", // get call
    createRuleModel: "model-design/api/v1/rule", // post call
    updateRuleModel: "model-design/api/v1/rule", // put call
    getRuleModel: "model-design/api/v1/rule", // get call

    //business event
    createBusinessEvent: "model-design/api/v1/businessEvent", // post call
    getBusinessEvents: "model-design/api/v1/businessEvent", // get call
    updateBusinessEvent: "model-design/api/v1/businessEvent", // put call

    //business rule mapper
    getBusinessEventRules:
      "model-design/api/v1/businessEvent/businessEventRule", // get call
    createBusinessEventRule:
      "model-design/api/v1/businessEvent/businessEventRule", // post call
    updateBusinessEventRule:
      "model-design/api/v1/businessEvent/businessEventRule", // put call
  },
};

export const addHostName = (url: string) => `${env.apiHostName + url}`;

export const env = {
  apiHostName: "http://35.236.18.89/",
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
    getRuleModel: "model-design/api/v1/rule", // get call
  },
};

export const addHostName = (url: string) => `${env.apiHostName + url}`;

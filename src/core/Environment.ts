export const env = {
  apiHostName: "http://35.236.18.89/",
  apis: {
    getAttributes: "model-design/api/v1/readXml", // post call
    getTradeModels: "model-design/api/v1/tradeModel", // get call
    updateTradeModel: "model-design/api/v1/tradeModel", // put call
    createTradeModel: "model-design/api/v1/tradeModel", // post call
  },
};

export const addHostName = (url: string) => `${env.apiHostName + url}`;

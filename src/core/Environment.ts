export const env = {
  apiHostName: "http://http://35.236.18.89/",
};

export const addHostName = (url: string) => `${env.apiHostName + url}`;

export const TradeAttributes = [
    "TxnTM",
    "TrdDt",
    "CumQty",
    "LeavesQty",
    "LastMkt",
    "LastPX",
    "LastQty",
    "ExecTyp",
] as const;

export type AttributeType = typeof TradeAttributes[number];

export type Trade = {
    tradeModelId: string;
    tradeModelName: string;
    tradeChannelName: string;
    attributes: Array<AttributeType>;
};
  

  
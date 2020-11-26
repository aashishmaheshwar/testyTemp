import * as yup from "yup";

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

export const TradeModelValidationSchema = yup.object().shape({
    tradeModelName: yup.string().required("Trade Model Name is required"),
    tradeChannelName: yup.string().required("Trade Channel Name is required"),
});

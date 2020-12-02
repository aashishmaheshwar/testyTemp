import * as yup from "yup";

export const TradeModelValidationSchema = yup.object().shape({
    tradeModelName: yup.string().required("Trade Model Name is required"),
    tradeChannelName: yup.string().required("Trade Channel Name is required"),
});
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useRuleMapperStyles = makeStyles((theme: Theme) =>
  createStyles({
    attributeWrapper: {
      display: "flex",
      flexDirection: "column",
      rowGap: "15px",
      marginBottom: "20px",
      "& > div": {
        display: "flex",
        placeItems: "end",
        "& > div": {
          "&.MuiFormControl-root": {
            flex: 1,
          },
          "&.MuiTextField-root": {
            flex: 1,
            margin: "3px 10px 0 0",
          },
          marginRight: "10px",
          "& .MuiSelect-root": {
            textAlign: "left",
          },
        },
      },
    },
    acRoot: {
      flex: 1,
      "& .MuiTextField-root": {
        margin: 0,
      },
    },
    acInput: {
      padding: "6px 0 !important",
    },
    argsRoot: {
      flex: 2,
    },
    mappedToRoot: {
      flex: 3,
    },
  })
);

import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useRuleModelStyles = makeStyles((theme: Theme) =>
  createStyles({
    ruleName: {
      marginBottom: "15px",
    },
    attributeWrapper: {
      display: "flex",
      flexDirection: "column",
      rowGap: "15px",
      marginBottom: "20px",
      "& > div": {
        display: "flex",
        "& > ul": {
          flex: 4
        },
        "& > div": {
          "&.MuiFormControl-root": {
            flex: 1,
          },
          "&.MuiTextField-root": {
            flex: 3,
            margin: "3px 10px 0 0",
          },
          marginRight: "10px",
          "& .MuiSelect-root": {
            textAlign: "left",
          },
        },
      },
    },
    valuesRoot: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
      maxWidth: "500px",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    attributeInputBlur: {
      opacity: 0.3,
    },
    attributeInputFocus: {
      opacity: 1,
    },
  })
);

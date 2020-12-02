import React, { useState } from "react";
import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles

import { Query, Builder, Utils as QbUtils } from "react-awesome-query-builder";

// For Material-UI widgets only:
import MaterialConfig from "react-awesome-query-builder/lib/config/material";
import { makeStyles } from "@material-ui/core";
// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig; // or MaterialConfig or BasicConfig

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { id: QbUtils.uuid(), type: "group" };

const useStyles = makeStyles({
  root: {
    "& .group--actions": {
      opacity: "1 !important",
    },
    "& .rule--body": {
      textAlign: "start",
    },
    // "& .group-or-rule": {
    //   background: "whitesmoke",
    //   border: "1px solid lightgrey",
    // },
  },
});

const RuleQueryBuilder = ({ buildConfig, onTriggerCondition }: any) => {
  const classes = useStyles();
  const [config, setConfig] = useState({
    ...InitialConfig,
    ...buildConfig,
  });
  const [tree, setTree] = useState(
    QbUtils.checkTree(QbUtils.loadTree(queryValue as any), config)
  );

  const renderBuilder = (props: any) => (
    <div className="query-builder-container">
      <div
        className="query-builder qb-lite"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Builder {...props} />
      </div>
    </div>
  );

  const onChange = (immutableTree: any, newConfig: any) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setTree(immutableTree);
    setConfig(newConfig);
    const triggerCondition = QbUtils.queryString(immutableTree, newConfig);
    onTriggerCondition(triggerCondition || "");

    // const jsonTree = QbUtils.getTree(immutableTree);
    // console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  };

  const renderResult = () => (
    <div className="query-builder-result">
      <div>
        Query string:{" "}
        <pre>{JSON.stringify(QbUtils.queryString(tree, config))}</pre>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <Query
        {...config}
        value={tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      {/* {renderResult()} */}
    </div>
  );
};

export default RuleQueryBuilder;

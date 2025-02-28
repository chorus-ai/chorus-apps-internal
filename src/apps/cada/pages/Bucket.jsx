import React, { useEffect, useState } from "react";
import {
  Container,
  Breadcrumbs,
  IconButton,
} from "@mui/material";
import { connect } from "react-redux";
import { getBuckets } from "../redux/actions";
import { MdNavigateNext, MdHome } from "react-icons/md";
import BucketTable from "../sections/Bucket/BucketTable";

import { createTheme } from "@mui/material/styles";

const theme = createTheme();

function groupBy(arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    (x.type === "dir" ||
      ["adibin", "txt", "json", "undefined"].includes(x.path.split(".")[1])) &&
      memo[x[property]].push(x);
    return memo;
  }, {});
}

function Bucket({ buckets, getBuckets }) {
  const [path, setPath] = useState("");

  const handleClick = (name) => {
    setPath(path === "" ? name : `${path}/${name}`);
  };

  useEffect(() => {
    if (typeof buckets[path] === "undefined") {
      getBuckets(path);
    }
  }, []);

  useEffect(() => {
    if (typeof buckets[path] === "undefined") {
      getBuckets(path);
    }
  }, [path]);

  const groupedPath =
    buckets[path] && buckets[path].length > 0
      ? groupBy(buckets[path], "type")
      : [];

  console.log(groupedPath);
  return (
    <div style={{ display: "flex" }}>
      {buckets && buckets[path] && buckets[path].length > 0 && (
        <Container maxWidth="lg" sx={{ mt: theme.spacing(5) }}>
          <Breadcrumbs
            sx={{ paddingBlock: 2 }}
            separator={<MdNavigateNext />}
            aria-label="breadcrumb"
          >
            <IconButton onClick={() => setPath("")}>
              <MdHome />
            </IconButton>
            {path !== "" ? path.split("/").map((p) => <div> {p} </div>) : null}
          </Breadcrumbs>
          {groupedPath && (
            <BucketTable
              path={path}
              handleClickDir={handleClick}
              paths={groupedPath}
            />
          )}
        </Container>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  buckets: state.cada.buckets,
});

const mapDispatchToProps = (dispatch) => ({
  getBuckets: (subpath) => dispatch(getBuckets(subpath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bucket);

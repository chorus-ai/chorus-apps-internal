import { Divider, Paper } from '@mui/material';
import React from 'react';
import TokenTable from './Table';

export default function DataPanel({ patterns, selectedTokens }) {

  const headers = [
    {
      name: "tokens",
      align: "left",
      label: "Token"
    },
    {
      name: "sources",
      align: "left",
      label: "Source"
    },
    {
      name: "rr",
      align: "left",
      label: "Reference Range"
    }
  ];

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        // mr: 3,
        fontSize: "1.1rem",
        textAlign: "left",
        width: "100%",
      }}
    >
      {/* <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <div>{tokens?.ppv ? `PPV: ${tokens.ppv.toFixed(3)}` : 'Co-occurring tokens'}</div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "120px" }}>
          <FilterIcon filter="low" selected={filter === "low"} onClick={() => setFilter(curr => curr === "low" ? "none" : "low")} />
          <FilterIcon filter="high" selected={filter === "high"} onClick={() => setFilter(curr => curr === "high" ? "none" : "high")} />
          <FilterIcon filter="info" selected={filter === "info"} onClick={() => setFilter(curr => curr === "info" ? "none" : "info")} />
          <FilterIcon filter="clear" onClick={() => setFilter("none")} />
        </div>
      </Stack> */}

      {/* <Divider sx={{ my: 1 }} /> */}

      {/* token table */}
      <div className="token-table" id="token-table" style={{ display: "flex", overflow: "scroll", scrollbarWidth: "none", msOverflowStyle: "none", width: "100%" }}>
        <div className="table">
          <div>Pattern A</div>
          <Divider sx={{ my: 1 }} />
          <TokenTable
            headers={headers}
            tokens={patterns[0]}
            otherTokens={patterns[1]}
            selectedTokens={selectedTokens}
          />
        </div>
        <Divider orientation='vertical' variant="middle" flexItem />
        <div className="table">
          <div style={{marginLeft: "16px"}}>Pattern B</div>
          <Divider sx={{ my: 1 }} />
          <TokenTable
            headers={headers}
            tokens={patterns[1]}
            otherTokens={patterns[0]}
            selectedTokens={selectedTokens}
          />
        </div>
      </div>

      <style>
        {`
          #token-table::-webkit-scrollbar {
            display: none;
          }

          .table {
            width: 100%;
            padding: 10px;
            border-radius: 15px;
            transition: 0.3s;
          }

          .table:hover {
            background-color: rgba(166, 255, 199, 0.1);
          }
        `}
      </style>
    </Paper>
  )
}

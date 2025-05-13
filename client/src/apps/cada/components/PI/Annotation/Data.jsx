import React from 'react';
import HighlightText from './HighlightText';
import { Divider } from '@mui/material';

export default function PIDataPanel({ data, selectedWord, onConceptChange, values, title }) {

  return (
    <div>
      <div className="img-toolbar">
        <div className="title">
          {title}
        </div>
        <Divider />
      </div>
      {data && <HighlightText
        text={data?.text ?? ""}
        highlights={data?.info ?? []}
        selectedConcept={selectedWord}
        onHighlightClick={onConceptChange}
        values={values}
        userHighlight={false}
      />}
      <style>
        {`
          .img-toolbar {
            background-color: white;
            height: 53px;
            font-size: 20px;
            color: white;
            padding: 5px;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            height: 53px;
            overflow: scroll;
            scrollbar-width: none;
            position: sticky;
            top: 0;
          }

          .img-toolbar::-webkit-scrollbar {
            display: none;
          }

          .title {
            text-align: left;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 100%;
          }

          .img-toolbar .title::-webkit-scrollbar {
            display: none;
          }

          .img-toolbar div {
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
            color: grey;
          }
        `}
      </style>
    </div>
  )
}

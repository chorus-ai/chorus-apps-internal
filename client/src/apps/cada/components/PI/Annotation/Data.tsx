import HighlightText from './HighlightText';
import { Divider } from '@mui/material';
import Label from '../../../common/Label';

export default function PIDataPanel({ data, selectedWord, onConceptChange, values, title }) {

  console.log(data)

  const getMetaData = (data: any) => {
    if (!data || !data?.metadata) return [];
    const metadata = [];
    for (const key in data.metadata) {
      if (data.metadata[key] && data.metadata[key] !== "null") {
        metadata.push(`${key}: ${data.metadata[key]}`);
      }
    }
    return metadata;
  }

  return (
    <div>
      <div className="img-toolbar">
        <div className="title">
          {title}
        </div>
        {getMetaData(data).map((item, index) => (
          <Label
            key={index}
            color="info"
            style={{ marginLeft: 5, fontSize: '1rem' }}
          >
            {item}
          </Label>
        ))}
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
            flex-direction: row;
            align-items: center;
            height: 53px;
            width: 100%;
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
            margin-right: 10px;
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

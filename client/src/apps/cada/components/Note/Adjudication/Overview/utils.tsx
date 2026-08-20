import { MdCheck, MdRemove } from "react-icons/md";

export const createData = (
  note: any,
  file: any,
  concepts: any,
  annotators: any,
  completed: any,
  agreement: any,
  adjudicated: any,
  processedConcepts
) => {
  return {
    note,
    file,
    concepts,
    annotators,
    completed,
    agreement,
    adjudicated,
    ...processedConcepts,
  };
};

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export function getComparator(order: any, orderBy: any) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
};

export function stableSort(array: any, comparator: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
};

export function isAdjudicated(noteAdj: any) {
  if (noteAdj.length > 0) {
    return <MdCheck style={{ color: "#079992" }} />;
  }
  return <MdRemove />;
};

export function getCompleted(annotations: any) {
  let completed = 0;
  for (const element of annotations) {
    if (element.completed === true) {
      completed = completed + 1;
    }
  }
  return completed;
}

export function getConcepts(annotations: any) {
  let concepts = {};
  let temp = {};
  for (const element of annotations) {
    let annotationObj = element.cadaAnnotationValues;
    if (annotationObj.length > 0) {
      for (const val of annotationObj) {
        if (temp[val.field]) {
          if (temp[val.field][element.userId]) {
            temp[val.field][element.userId] =
              temp[val.field][element.userId][val.id] > val.id
                ? temp[val.field][element.userId]
                : { id: val.id, value: val.value };
          } else {
            temp[val.field][element.userId] = {
              id: val.id,
              value: val.value,
            };
          }
        } else {
          temp[val.field] = {
            [element.userId]: { id: val.id, value: val.value },
          };
        }
      }
    }
  }
  concepts["annotationDetail"] = Object.keys(temp).map((c) => ({
    conceptId: c,
    value: temp[c],
  }));
  return concepts;
}

export function calculateNoteAgreement(note: any) {
  let percentage = 0;
  let temp = [];
  let average = (array: any) => array.reduce((a: any, b: any) => a + b) / array.length;
  if (Object.keys(note).length === 0) {
    percentage = 0;
  } else {
    for (let con in note) {
      temp.push(note[con][1]);
    }
    percentage = average(temp);
  }

  return parseInt(percentage, 10);
};

export const percentageColor = (percentage: any) => {
  if (percentage <= 50 && percentage > 0)
    return { label: "Poor", color: "#b8e994" };
  if (percentage <= 60 && percentage > 50)
    return { label: "Weak", color: "#78e08f" };
  if (percentage <= 70 && percentage > 60)
    return { label: "Normal", color: "#38ada9" };
  if (percentage <= 80 && percentage > 70)
    return { label: "Good", color: "#079992" };
  if (percentage > 80) return { label: "Strong", color: "#f6b93b" };
  return { label: "Poor", color: "#b8e994" };
};
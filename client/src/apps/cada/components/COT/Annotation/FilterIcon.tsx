
const colors = (a: any) => {
  return {
    low: `rgba(240, 68, 56, ${a})`,
    high: `rgba(16, 185, 129, ${a})`,
    info: `rgba(6, 174, 212, ${a})`,
  };
}

const useStyles = (filter: any, selected: any) => {
  return {
    width: "24px",
    height: "24px",
    backgroundColor: colors(selected ? 0.8 : 0.4)[filter],
    border: filter === "clear" ? "1px dashed rgb(165, 165, 165)" : "",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  };
};

export default function FilterIcon({ filter, selected, onClick }: { filter: any; selected: any; onClick: any }) {

  const handleClick = () => {
    if (onClick !== undefined) {
      onClick();
    }
  };

  return (
    <div style={useStyles(filter, selected)} onClick={handleClick}>
    </div>
  );
}

import { Box, Button, IconButton, TextField } from "@mui/material";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const DEFAULT_OPTION = "Enter option";

export default function ChecklistBuilder({ label, options, setOptions, onChangeLabel }: { label: any; options: any; setOptions: any; onChangeLabel: any }) {
  const handleAddOption = () => {
    setOptions([...options, DEFAULT_OPTION]);
  };

  const handleRemoveOption = (index: any) => {
    setOptions(options.filter((_: any, i: any) => i !== index));
  };

  const handleOptionChange = (index: any, value: any) => {
    setOptions(options.map((option: any, i: any) => i === index ? value : option));
  };

  const handleOptionUp = (index: any) => {
    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index - 1];
    newOptions[index - 1] = temp;
    setOptions(newOptions);
  };

  const handleOptionDown = (index: any) => {
    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index + 1];
    newOptions[index + 1] = temp;
    setOptions(newOptions);
  };

  return (
    <>
      <TextField
        fullWidth
        label="Label"
        margin="dense"
        name="label"
        onChange={onChangeLabel}
        required
        value={label}
        variant="standard"
        InputLabelProps={{ shrink: true }}
      />
      {options.map((option: any, index: any) => (
        <Box key={index} sx={{ p: 1.2, pl: 3, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            margin="dense"
            name={`option-${index}`}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
            value={option}
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
          <IconButton
            size="small"
            disabled={index === 0}
            onClick={() => handleOptionUp(index)}
            sx={{ ml: 2 }}
          >
            <FaChevronUp />
          </IconButton>
          <IconButton
            size="small"
            disabled={index === options.length - 1}
            onClick={() => handleOptionDown(index)}
            sx={{ ml: 0.5 }}
          >
            <FaChevronDown />
          </IconButton>
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={() => handleRemoveOption(index)}
          >
            <MdDelete />
          </IconButton>
        </Box>
      ))}
      <Box sx={{ p: 1.5 }}>
        <Button variant="text" onClick={handleAddOption}>Add an option</Button>
      </Box>
    </>
  );
};

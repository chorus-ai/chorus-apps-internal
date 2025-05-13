import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const DEFAULT_OPTION = "Enter option";

export default function ChecklistBuilder({ label, options, setOptions, onChangeLabel }) {
  const handleAddOption = () => {
    setOptions([...options, DEFAULT_OPTION]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    setOptions(options.map((option, i) => i === index ? value : option));
  };

  const handleOptionUp = (index) => {
    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index - 1];
    newOptions[index - 1] = temp;
    setOptions(newOptions);
  };

  const handleOptionDown = (index) => {
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
      {options.map((option, index) => (
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

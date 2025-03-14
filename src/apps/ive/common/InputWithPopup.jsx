import React, { useState, useRef } from "react";
import { TextField, Popper, Paper, List, ListItem, ClickAwayListener } from "@mui/material";

export const InputWithPopup = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <TextField
        label="Type something"
        variant="outlined"
        fullWidth
        onFocus={handleFocus}
        inputRef={inputRef}
      />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={{ width: inputRef.current?.offsetWidth || 200, padding: 1 }}>
            <List>
              <ListItem button onClick={handleClose}>Option 1</ListItem>
              <ListItem button onClick={handleClose}>Option 2</ListItem>
              <ListItem button onClick={handleClose}>Option 3</ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Divider,
  Popover,
  Typography,
  Alert,
} from "@mui/material";
import { MdDeleteForever, MdPalette } from "react-icons/md";

const useStyles = {
  container: {
    display: "flex",
  },
  delete: {
    position: "relative",
    top: 20,
    marginLeft: 5,
    color: "#7f8c8d",
  },
};

interface LabelAttribute {
  name: string;
  value: string;
  color: string;
}

interface AddLabelFormProps {
  attributes: LabelAttribute[];
  handleChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (index: number, color: string) => void;
  handleDelete: (index: number) => void;
  handleAdd: () => void;
}

const AddLabelForm = ({
  attributes,
  handleChange,
  handleColorChange,
  handleDelete,
  handleAdd,
}: AddLabelFormProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Grid container spacing={2}>
      {attributes.length === 0 ? (
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="body2" color="textSecondary" component="p">
            No labels!
          </Typography>
        </Grid>
      ) : (
        ""
      )}
      <Grid size={12}>
        <Alert
          icon={false}
          color="primary"
          action={
            <div>
              <Button disabled={false} size="small" onClick={handleAdd}>
                ADD
              </Button>
            </div>
          }
        >
          Labels
        </Alert>
      </Grid>
      {attributes.length > 0 &&
        attributes.map((value: LabelAttribute, index: number) => (
          <React.Fragment key={index}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="Name"
                margin="dense"
                name="name"
                value={value.name ? value.name : ""}
                onChange={handleChange(index)}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                label="Value"
                margin="dense"
                name="value"
                required
                value={value.value ? value.value : ""}
                onChange={handleChange(index)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <div style={{ ...useStyles.container }}>
                <IconButton sx={{ mt: 2 }} onClick={handleClick}>
                  <MdPalette color={value.color ? value.color : ""} />
                </IconButton>

                <IconButton sx={{ mt: 2 }} onClick={() => handleDelete(index)}>
                  <MdDeleteForever />
                </IconButton>
              </div>
              <Popover
                id={id}
                s
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "top",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Grid>
                    {[
                      "#1abc9c",
                      "#16a085",
                      "#2ecc71",
                      "#27ae60",
                      "#3498db",
                      "#2980b9",
                    ].map((color) => (
                      <IconButton
                        onClick={() => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                  <Grid>
                    {[
                      "#e056fd",
                      "#be2edd",
                      "#686de0",
                      "#4834d4",
                      "#30336b",
                      "#130f40",
                    ].map((color) => (
                      <IconButton
                        onClick={() => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                  <Divider />
                  <Grid>
                    {[
                      "#f1c40f",
                      "#f39c12",
                      "#e67e22",
                      "#d35400",
                      "#e74c3c",
                      "#c0392b",
                    ].map((color) => (
                      <IconButton
                        onClick={(color) => {
                          handleColorChange(index, color);
                          handleClose();
                        }}
                      >
                        <MdPalette color={color} />
                      </IconButton>
                    ))}
                  </Grid>
                </Grid>
              </Popover>
            </Grid>
          </React.Fragment>
        ))}
    </Grid>
  );
};
export default AddLabelForm;

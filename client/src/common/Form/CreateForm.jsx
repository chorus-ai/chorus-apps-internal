import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import React from 'react';
import { MdDelete } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import MultipleChoiceBuilder from './Builders/MultipleChoiceBuilder';
import DateTimeBuilder from './Builders/DateTimeBuilder';
import TextFieldBuilder from './Builders/TextFieldBuilder';
import ChecklistBuilder from './Builders/ChecklistBuilder';

const getDefaultForm = (form) => ({
  label: "Enter form label",
  type: "text",
  required: true,
  order: form.length + 1,
  options: null,
  active: true,
});

const FIELD_TYPES = [
  "text",
  "multiple choice",
  "checklist",
  "datetime",
  "slider",
]

const FIELD_TYPES_TO_COMPONENT = (form, setForm, idx) => {
  switch (form[idx]?.type) {
    case "text":
      return <TextFieldBuilder
        value={form[idx]?.label || ""}
        onChange={(e) =>
          setForm(
            curr =>
              curr.map(
                (field, i) =>
                  i === idx ?
                    { ...field, label: e.target.value } :
                    field
              )
          )
        }
      />;
    case "multiple choice":
      if (!form[idx]?.options) {
        setForm(curr => curr.map((field, i) => i === idx ? { ...field, options: [] } : field));
      }

      return <MultipleChoiceBuilder
        label={form[idx]?.label || ""}
        options={form[idx]?.options || []}
        setOptions={(options) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, options } : field))}
        onChangeLabel={(e) =>
          setForm(
            curr =>
              curr.map(
                (field, i) =>
                  i === idx ?
                    { ...field, label: e.target.value } :
                    field
              )
          )
        }
      />;
    case "checklist":
      if (!form[idx]?.options) {
        setForm(curr => curr.map((field, i) => i === idx ? { ...field, options: [] } : field));
      }

      return <ChecklistBuilder
        label={form[idx]?.label || ""}
        options={form[idx]?.options || []}
        setOptions={(options) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, options } : field))}
        onChangeLabel={(e) =>
          setForm(
            curr =>
              curr.map(
                (field, i) =>
                  i === idx ?
                    { ...field, label: e.target.value } :
                    field
              )
          )
        }
      />;
    case "datetime":
      return (
        <DateTimeBuilder
          value={form[idx]?.label || ""}
          onChange={(e) =>
            setForm(
              curr =>
                curr.map(
                  (field, i) =>
                    i === idx ?
                      { ...field, label: e.target.value } :
                      field
                )
            )
          }
        />
      )
    default:
      return <UnknownField />;
  }
};

const UnknownField = () => {
  return (
    <Typography variant="h6" color="error">Unknown field type</Typography>
  )
}

const DEFAULT_TRIGGER = {
  condition: "",
  action: "show",
  field: "",
};

const resetTriggers = (form) => {
  const newForm = [...form];

  if (newForm[0].triggers) {
    delete newForm[0].triggers;
  }

  for (let i = 1; i < newForm.length; i++) {
    const field = newForm[i];
    if (field?.triggers) {
      for (const trigger of field.triggers) {
        const triggerField = newForm.find(f => f.label === trigger.field);
        const triggerFieldIndex = newForm.indexOf(triggerField);
        if (triggerFieldIndex > i - 1) {
          newForm[i].triggers = field.triggers.filter(t => t.field !== trigger.field);
        }
      }
    }

    if (field?.triggers?.length === 0) {
      delete newForm[i].triggers;
    }
  }

  return newForm;
}

const FormFieldBuilder = ({ form, setForm, idx }) => {
  const handleUp = () => {
    const newForm = [...form];
    const temp = newForm[idx];
    newForm[idx] = newForm[idx - 1];
    newForm[idx - 1] = temp;

    setForm(resetTriggers(newForm));
  };

  const handleDown = () => {
    const newForm = [...form];
    const temp = newForm[idx];
    newForm[idx] = newForm[idx + 1];
    newForm[idx + 1] = temp;

    setForm(resetTriggers(newForm));
  }

  const handleAddTrigger = () => {
    setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: [...(field.triggers || []), DEFAULT_TRIGGER] } : field));
  };

  const handleRemove = () => {
    let newForm = JSON.parse(JSON.stringify(form));
    newForm = newForm.filter((_, i) => i !== idx);

    setForm(resetTriggers(newForm));
  }

  return (
    <Card>
      <CardHeader title={`Question ${idx + 1}`} />
      <CardContent>
        {FIELD_TYPES_TO_COMPONENT(form, setForm, idx)}
        <Box sx={{ mt: 2 }}>
          {form[idx]?.triggers?.map((trigger, triggerIdx) => (
            <Box key={triggerIdx} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <FormControl sx={{ mr: 2 }}>
                <InputLabel id="field-label">Field</InputLabel>
                <Select
                  label="Field"
                  value={trigger.field || ""}
                  onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: field.triggers.map((t, ti) => ti === triggerIdx ? { ...t, field: e.target.value } : t) } : field))}
                  sx={{ height: 40 }}
                >
                  {form.map((field, i) => (i < idx &&
                    <MenuItem key={i} value={field.label}>
                      {field.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Text condition */}
              {["text"].includes(form.find(f => f.label === trigger.field)?.type) && (
                <TextField
                  variant="outlined"
                  label="Value"
                  value={trigger.condition || ""}
                  size="small"
                  sx={{ mr: 2 }}
                  onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: field.triggers.map((t, ti) => ti === triggerIdx ? { ...t, condition: e.target.value } : t) } : field))}
                />
              )}

              {/* multiple choice condition */}
              {form.find(f => f.label === trigger.field)?.type === "multiple choice" && <FormControl sx={{ mr: 2 }}>
                <InputLabel id="condition-label">Condition</InputLabel>
                <Select
                  label="Condition"
                  value={trigger.condition || ""}
                  onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: field.triggers.map((t, ti) => ti === triggerIdx ? { ...t, condition: e.target.value } : t) } : field))}
                  sx={{ height: 40 }}
                >
                  {form.find(f => f.label === trigger.field)?.options?.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>}
              <FormControl sx={{ mr: 2 }}>
                <InputLabel id="action-label">Action</InputLabel>
                <Select
                  label="Action"
                  value={trigger.action || ""}
                  onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: field.triggers.map((t, ti) => ti === triggerIdx ? { ...t, action: e.target.value } : t) } : field))}
                  sx={{ height: 40 }}
                >
                  <MenuItem value="show">Show</MenuItem>
                  <MenuItem value="hide">Hide</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                size="small"
                sx={{ ml: 0.5 }}
                onClick={() => setForm(curr => curr.map((field, i) => i === idx ? { ...field, triggers: field.triggers.filter((_, ti) => ti !== triggerIdx) } : field))}
              >
                <MdDelete />
              </IconButton>
            </Box>
          ))}
          {idx > 0 && <Button variant="outlined" sx={{ mt: 2 }} onClick={handleAddTrigger}>Add a trigger</Button>}
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="left">
          <IconButton
            disabled={idx === 0}
            onClick={handleUp}
          >
            <FaChevronUp />
          </IconButton>
          <IconButton
            disabled={idx === form.length - 1}
            onClick={handleDown}
          >
            <FaChevronDown />
          </IconButton>
          <FormControl sx={{ ml: 2 }}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              label="Type"
              value={form[idx]?.type || ""}
              onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, type: e.target.value } : field))}
              sx={{ height: 40, mr: 2 }}
            >
              {FIELD_TYPES.map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Required"
            value={form[idx]?.required ?? false}
            onChange={(e) => setForm(curr => curr.map((field, i) => i === idx ? { ...field, required: e.target.checked } : field))}
          />
        </div>
        <div className="right">
          <IconButton onClick={handleRemove}>
            <MdDelete />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
};

export default function CreateForm({ form, setForm }) {

  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      {form.map((_, index) => (
        <Grid key={index} item md={12} xs={12}>
          <FormFieldBuilder form={form} setForm={setForm} idx={index} />
        </Grid>
      ))}
      <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setForm(curr => [...curr, getDefaultForm(curr)])}>
          Add Field
        </Button>
      </Grid>
    </Grid>
  );
};

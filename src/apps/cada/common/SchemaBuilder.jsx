import React, { useState } from "react";

const SchemaBuilder = ({ onSchemaChange }) => {
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([
      ...fields,
      { name: "", type: "text", parentSelect: "", options: [] },
    ]);
  };

  const updateField = (index, field) => {
    const newFields = [...fields];
    newFields[index] = field;
    setFields(newFields);
    onSchemaChange(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onSchemaChange(newFields);
  };

  return (
    <div>
      <h2>Schema Builder</h2>
      <button onClick={addField}>Add Field</button>
      <div>
        {fields.map((field, index) => (
          <div key={index}>
            <input
              placeholder="Field Name"
              value={field.name}
              onChange={(e) =>
                updateField(index, { ...field, name: e.target.value })
              }
            />
            <select
              value={field.type}
              onChange={(e) =>
                updateField(index, { ...field, type: e.target.value })
              }
            >
              <option value="text">Text</option>
              <option value="select">Select</option>
            </select>
            {field.type === "select" && (
              <div>
                <input
                  placeholder="Options (comma separated)"
                  onChange={(e) =>
                    updateField(index, {
                      ...field,
                      options: e.target.value.split(",").map((o) => o.trim()),
                    })
                  }
                />
              </div>
            )}
            <select
              value={field.parentSelect}
              onChange={(e) =>
                updateField(index, { ...field, parentSelect: e.target.value })
              }
            >
              <option value="">No Parent</option>
              {fields
                .filter((f, i) => i !== index && f.type === "select")
                .map((f, i) => (
                  <option key={i} value={f.name}>
                    {f.name}
                  </option>
                ))}
            </select>
            <button onClick={() => removeField(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaBuilder;

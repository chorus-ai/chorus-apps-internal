import React, { useState, useEffect } from "react";

const DynamicForm = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [selectOptions, setSelectOptions] = useState({});
  const [visibleFields, setVisibleFields] = useState({});

  useEffect(() => {
    const newVisibleFields = {};
    const newSelectOptions = {};

    schema.forEach((field) => {
      const parent = field.parentSelect;

      // If the field has no parent or its parent is visible and has data
      if (!parent || (visibleFields[parent] && formData[parent])) {
        newVisibleFields[field.name] = true;

        if (field.type === "select" && field.optionsMap && formData[parent]) {
          newSelectOptions[field.name] = field.optionsMap[formData[parent]];
        }
      } else {
        newVisibleFields[field.name] = false;
      }
    });

    setSelectOptions(newSelectOptions);
    setVisibleFields(newVisibleFields);
  }, [formData, schema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema.map((field, index) => (
        <div key={index}>
          {visibleFields[field.name] && (
            <>
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                >
                  {(selectOptions[field.name] || field.options || []).map(
                    (option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                />
              )}
            </>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;

import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddProject from "./AddProjectForm";
import AddLabel from "./AddLabelForm";
import ReviewCard from "./AddProjectReviewCard";

import { createTheme } from "@mui/material/styles";
import CreateForm from "../../common/Form/CreateForm";
import { useCreateProject } from "../../hooks";
import type { ProjectCreatePayload, EditFormField } from "../../types";

const theme = createTheme();

const useStyles = {
  root: {
    minWidth: 600,
    padding: theme.spacing(2),
  },
  paper: {
    width: "100%",
  },
};

interface LabelAttribute {
  name: string;
  value: string;
  color: string;
}

const steps = ["Add project", "Add form", "Add labels", "Review project"];

export default function NewProject({ handleClose }: { handleClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<LabelAttribute[]>([]);
  const [form, setForm] = useState<EditFormField[]>([]);

  const createProject = useCreateProject();

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <AddProject values={values} handleFormChange={handleFormChange} />
        );
      case 1:
        return (
          <CreateForm form={form} setForm={setForm} />
        );
      case 2:
        return (
          <AddLabel
            attributes={attributes}
            handleChange={handleAttributeChange}
            handleColorChange={handleColorChange}
            handleDelete={handleAttributeDelete}
            handleAdd={handleAttributeAdd}
          />
        );
      case 3:
        return <ReviewCard card={values} attributes={attributes} />;
      default:
        throw new Error("Unknown step");
    }
  }
  const handleSave = () => {
    let newArr = {
      ...values,
      attributes: JSON.stringify({ Buttons: attributes }),
    };
    createProject.mutate({ payload: newArr, form });
    setTimeout(handleClose, 1000);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleAttributeChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArr = [...attributes];
    const propertyName = e.target.name as keyof LabelAttribute;
    newArr[index] = { ...newArr[index], [propertyName]: e.target.value };
    setAttributes(newArr);
  };

  const handleColorChange = (index: number, color: string) => {
    const newArr = [...attributes];
    newArr[index] = { ...newArr[index], color };
    setAttributes(newArr);
  };

  const handleAttributeDelete = (index: number) => {
    const newArr = [...attributes];
    newArr.splice(index, 1);
    setAttributes(newArr);
  };

  const handleAttributeAdd = () => {
    setAttributes([...attributes, { name: "", value: "", color: "" }]);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    activeStep + 1 === steps.length && handleSave();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div style={{ ...useStyles.root }}>
      <Paper style={{ ...useStyles.paper }}>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="subtitle1">Done!</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {getStepContent(activeStep)}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
    </div>
  );
}

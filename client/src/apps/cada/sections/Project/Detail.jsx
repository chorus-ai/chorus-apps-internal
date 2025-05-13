import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Tabs, Tab, Box } from '@mui/material';
import FormDisplay from '../../../../common/Form/FormDisplay';

function TabPanel({ children, value, index }) {
  return value === index && (
    <Box sx={{ pt: 2 }}>
      {children}
    </Box>
  );
}

export default function ProjectDetail({ project }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({});
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (!project?.forms || project.forms.length === 0) return;

    const fid = project.forms[0].id;

    axios.get(`/api/form/form/${fid}`)
      .then(res => setForm(res.data))
      .catch(err => console.error("Failed to fetch form details:", err));
  }, [project]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  return (
    <Container maxWidth="xl" sx={{ mt: 3}}>
    

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Events" />
        <Tab label="Users" />
        <Tab label="Form" />
        <Tab label="Config" />
        <Tab label="Preview" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Typography>Events section (to be implemented)</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              Project Form
            </Typography>
            {Object.keys(form).length > 0 && (
              <FormDisplay form={form} values={values} setValues={setValues} />
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Config section (to be implemented)</Typography>
      </TabPanel>
    </Container>
  );
}
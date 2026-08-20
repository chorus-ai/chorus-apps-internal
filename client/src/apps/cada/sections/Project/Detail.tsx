import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import Form from './ProjectDetails/Form';
import Events from './ProjectDetails/Events';
import Users from './ProjectDetails/Users';
import Preview from './ProjectDetails/Preview';
import type { Project } from '../../hooks';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index && (
    <Box sx={{ pt: 2 }}>
      {children}
    </Box>
  );
}

export default function ProjectDetail({ project }: { project: Project | null | undefined }) {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    { label: 'Events', component: <Events project={project} /> },
    { label: 'Users', component: <Users project={project} /> },
    { label: 'Form', component: <Form project={project} /> },
    { label: 'Config', component: <div>Config</div> },
    { label: 'Preview', component: <Preview project={project} /> },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        {project.name || project.title} Project
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor='primary'
        textColor='primary'
        sx={{
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={tabIndex} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Container>
  );
}

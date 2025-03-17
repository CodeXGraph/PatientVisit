import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
import SaveIcon from '@mui/icons-material/Save';
import MedicationIcon from '@mui/icons-material/Medication';
import SickIcon from '@mui/icons-material/Sick';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`summary-tabpanel-${index}`}
      aria-labelledby={`summary-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const SummaryDisplay = ({ summary, isLoading, error }) => {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating summary...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a moment
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" color="primary">
          Try Again
        </Button>
      </Paper>
    );
  }

  if (!summary) {
    return null;
  }

  // Parse the summary sections
  let summaryText = summary.summary;
  let diagnoses = [];
  let symptoms = [];
  let medications = [];
  let procedures = [];

  // This is a simplified example, in a real app we would parse the structured summary data
  if (summary.summary) {
    const diagnosesMatch = summary.summary.match(/Diagnoses:([\s\S]*?)(?:\n\n|\n$)/);
    const symptomsMatch = summary.summary.match(/Symptoms:([\s\S]*?)(?:\n\n|\n$)/);
    const medicationsMatch = summary.summary.match(/Medications:([\s\S]*?)(?:\n\n|\n$)/);
    const proceduresMatch = summary.summary.match(/Procedures\/Treatments:([\s\S]*?)(?:\n\n|\n$)/);

    if (diagnosesMatch) {
      diagnoses = diagnosesMatch[1].trim().split(/\s*-\s*/).filter(Boolean).map(item => item.trim());
    }
    if (symptomsMatch) {
      symptoms = symptomsMatch[1].trim().split(/\s*-\s*/).filter(Boolean).map(item => item.trim());
    }
    if (medicationsMatch) {
      medications = medicationsMatch[1].trim().split(/\s*-\s*/).filter(Boolean).map(item => item.trim());
    }
    if (proceduresMatch) {
      procedures = proceduresMatch[1].trim().split(/\s*-\s*/).filter(Boolean).map(item => item.trim());
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summaryText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `patient_summary_${summary.patientId || 'unknown'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Paper elevation={3} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Summary" />
          <Tab label="Medical Details" />
          <Tab label="Transcription" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Patient Visit Summary
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
          {summary.summary?.split('SUMMARY:')[1]?.split('KEY MEDICAL INFORMATION:')[0]?.trim() || 'No summary available'}
        </Box>
        
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            color={copied ? "success" : "primary"}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<GetAppIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Save to EHR
          </Button>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Medical Details
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalHospitalIcon color="primary" sx={{ mr: 1 }} /> Diagnoses
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis, index) => (
                <Chip 
                  key={index} 
                  label={diagnosis} 
                  color="primary" 
                  variant="outlined" 
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No diagnoses recorded</Typography>
            )}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SickIcon color="error" sx={{ mr: 1 }} /> Symptoms
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {symptoms.length > 0 ? (
              symptoms.map((symptom, index) => (
                <Chip 
                  key={index} 
                  label={symptom} 
                  color="error" 
                  variant="outlined" 
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No symptoms recorded</Typography>
            )}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicationIcon color="success" sx={{ mr: 1 }} /> Medications
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {medications.length > 0 ? (
              medications.map((medication, index) => (
                <Chip 
                  key={index} 
                  label={medication} 
                  color="success" 
                  variant="outlined" 
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No medications recorded</Typography>
            )}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MonitorHeartIcon color="secondary" sx={{ mr: 1 }} /> Procedures/Treatments
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {procedures.length > 0 ? (
              procedures.map((procedure, index) => (
                <Chip 
                  key={index} 
                  label={procedure} 
                  color="secondary" 
                  variant="outlined" 
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No procedures recorded</Typography>
            )}
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Transcription
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ whiteSpace: 'pre-wrap', mb: 3, maxHeight: 300, overflow: 'auto', backgroundColor: '#f8f8f8', p: 2, borderRadius: 1 }}>
          {summary.transcription || 'No transcription available'}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          Note: This is an automated transcription and may not be 100% accurate.
        </Typography>
      </TabPanel>
    </Paper>
  );
};

export default SummaryDisplay;
import React, { useState } from 'react';
import { Box, Typography, Container, Stepper, Step, StepLabel, Button, Paper } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import PatientForm from '../components/PatientForm';
import AudioRecorder from '../components/AudioRecorder';
import SummaryDisplay from '../components/SummaryDisplay';

const steps = ['Patient Information', 'Record Visit', 'Review Summary'];

const RecordVisit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [patient, setPatient] = useState({
    patientId: '',
    patientName: '',
    visitDate: new Date().toISOString().split('T')[0],
    physician: '',
    notes: ''
  });
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRecordingComplete = (data) => {
    setSummary(data);
    setActiveStep(2);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PatientForm patient={patient} setPatient={setPatient} />;
      case 1:
        return <AudioRecorder onRecordingComplete={handleRecordingComplete} />;
      case 2:
        return <SummaryDisplay summary={summary} isLoading={isLoading} error={error} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Record Patient Visit
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<NavigateBeforeIcon />}
            >
              Back
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                >
                  Save & Finish
                </Button>
              ) : (
                activeStep === 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={<NavigateNextIcon />}
                    disabled={!patient.patientId}
                  >
                    Next
                  </Button>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecordVisit;
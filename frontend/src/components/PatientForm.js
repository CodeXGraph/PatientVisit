import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Paper,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const PatientForm = ({ patient, setPatient }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Patient Information
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Patient ID"
            name="patientId"
            value={patient.patientId}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Visit Date"
            name="visitDate"
            type="date"
            value={patient.visitDate}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Patient Name"
            name="patientName"
            value={patient.patientName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Physician"
            name="physician"
            value={patient.physician}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalHospitalIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={patient.notes}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatientForm;
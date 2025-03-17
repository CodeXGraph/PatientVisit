import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Slider,
  MenuItem,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Settings = () => {
  const [settings, setSettings] = useState({
    audioSettings: {
      noiseReduction: true,
      voiceIsolation: true,
      sampleRate: 44100,
      noiseThreshold: 75
    },
    processingSettings: {
      model: 'whisper-medical',
      language: 'en',
      summarizationLevel: 'detailed'
    },
    privacySettings: {
      encryptData: true,
      autoDeleteAfter: 30,
      saveTranscripts: true
    },
    apiSettings: {
      apiKey: 'sk-*****************************',
      endpoint: 'https://api.example.com/v1'
    }
  });

  const [saved, setSaved] = useState(false);

  const handleAudioSettingsChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      audioSettings: {
        ...settings.audioSettings,
        [name]: newValue
      }
    });
    
    setSaved(false);
  };

  const handleProcessingSettingsChange = (event) => {
    const { name, value } = event.target;
    
    setSettings({
      ...settings,
      processingSettings: {
        ...settings.processingSettings,
        [name]: value
      }
    });
    
    setSaved(false);
  };

  const handlePrivacySettingsChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      privacySettings: {
        ...settings.privacySettings,
        [name]: newValue
      }
    });
    
    setSaved(false);
  };

  const handleApiSettingsChange = (event) => {
    const { name, value } = event.target;
    
    setSettings({
      ...settings,
      apiSettings: {
        ...settings.apiSettings,
        [name]: value
      }
    });
    
    setSaved(false);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a database or local storage
    console.log('Saving settings:', settings);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <Container maxWidth="lg">
      {saved && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setSaved(false)}
        >
          Settings saved successfully!
        </Alert>
      )}
      
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Audio Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Audio Processing"
              subheader="Configure how audio is recorded and processed"
              action={
                <IconButton aria-label="audio settings info">
                  <InfoIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.audioSettings.noiseReduction}
                        onChange={handleAudioSettingsChange}
                        name="noiseReduction"
                        color="primary"
                      />
                    }
                    label="Noise Reduction"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.audioSettings.voiceIsolation}
                        onChange={handleAudioSettingsChange}
                        name="voiceIsolation"
                        color="primary"
                      />
                    }
                    label="Voice Isolation"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">Sample Rate</FormLabel>
                    <TextField
                      select
                      name="sampleRate"
                      value={settings.audioSettings.sampleRate}
                      onChange={handleAudioSettingsChange}
                      variant="outlined"
                      margin="dense"
                    >
                      <MenuItem value={16000}>16 kHz (Low Quality)</MenuItem>
                      <MenuItem value={22050}>22.05 kHz (Medium Quality)</MenuItem>
                      <MenuItem value={44100}>44.1 kHz (Standard Quality)</MenuItem>
                      <MenuItem value={48000}>48 kHz (High Quality)</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">
                      Noise Threshold ({settings.audioSettings.noiseThreshold}%)
                    </FormLabel>
                    <Slider
                      name="noiseThreshold"
                      value={settings.audioSettings.noiseThreshold}
                      onChange={(e, value) => {
                        handleAudioSettingsChange({
                          target: { name: 'noiseThreshold', value }
                        });
                      }}
                      min={0}
                      max={100}
                      step={1}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' }
                      ]}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Processing Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="AI Processing"
              subheader="Configure speech recognition and summarization"
              action={
                <IconButton aria-label="processing settings info">
                  <InfoIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">Speech Recognition Model</FormLabel>
                    <TextField
                      select
                      name="model"
                      value={settings.processingSettings.model}
                      onChange={handleProcessingSettingsChange}
                      variant="outlined"
                      margin="dense"
                    >
                      <MenuItem value="whisper-tiny">Whisper Tiny (Fast, Less Accurate)</MenuItem>
                      <MenuItem value="whisper-base">Whisper Base (Balanced)</MenuItem>
                      <MenuItem value="whisper-medical">Whisper Medical (Optimized for Healthcare)</MenuItem>
                      <MenuItem value="whisper-large">Whisper Large (Most Accurate, Slower)</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">Language</FormLabel>
                    <TextField
                      select
                      name="language"
                      value={settings.processingSettings.language}
                      onChange={handleProcessingSettingsChange}
                      variant="outlined"
                      margin="dense"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="auto">Auto-detect</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">Summarization Level</FormLabel>
                    <TextField
                      select
                      name="summarizationLevel"
                      value={settings.processingSettings.summarizationLevel}
                      onChange={handleProcessingSettingsChange}
                      variant="outlined"
                      margin="dense"
                    >
                      <MenuItem value="brief">Brief (Key points only)</MenuItem>
                      <MenuItem value="standard">Standard (Balanced)</MenuItem>
                      <MenuItem value="detailed">Detailed (Comprehensive)</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Privacy & Security"
              subheader="Configure how patient data is handled"
              action={
                <IconButton aria-label="privacy settings info">
                  <InfoIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacySettings.encryptData}
                        onChange={handlePrivacySettingsChange}
                        name="encryptData"
                        color="primary"
                      />
                    }
                    label="Encrypt Patient Data"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacySettings.saveTranscripts}
                        onChange={handlePrivacySettingsChange}
                        name="saveTranscripts"
                        color="primary"
                      />
                    }
                    label="Save Raw Transcripts"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">
                      Auto-delete After (Days)
                    </FormLabel>
                    <TextField
                      name="autoDeleteAfter"
                      type="number"
                      value={settings.privacySettings.autoDeleteAfter}
                      onChange={handlePrivacySettingsChange}
                      variant="outlined"
                      margin="dense"
                      InputProps={{ inputProps: { min: 0, max: 365 } }}
                      helperText="0 = Never auto-delete"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* API Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="API Configuration"
              subheader="Configure external API connections"
              action={
                <IconButton aria-label="api settings info">
                  <InfoIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">API Key</FormLabel>
                    <TextField
                      name="apiKey"
                      type="password"
                      value={settings.apiSettings.apiKey}
                      onChange={handleApiSettingsChange}
                      variant="outlined"
                      margin="dense"
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">API Endpoint</FormLabel>
                    <TextField
                      name="endpoint"
                      value={settings.apiSettings.endpoint}
                      onChange={handleApiSettingsChange}
                      variant="outlined"
                      margin="dense"
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                  >
                    Test Connection
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ mr: 2 }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;
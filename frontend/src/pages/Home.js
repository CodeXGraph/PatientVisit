import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid,
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Patient Visit Summarizer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Transform doctor-patient conversations into structured clinical summaries.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<MicIcon />}
            onClick={() => navigate('/record')}
            sx={{ mr: 2 }}
          >
            Record Visit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/summaries')}
          >
            View Summaries
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          mb: 4 
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
          Why use Patient Visit Summarizer?
        </Typography>
        <Typography variant="body1" paragraph>
          Our application uses advanced speech recognition with noise cancellation and voice isolation,
          combined with medical-specific language models to generate accurate clinical summaries from
          doctor-patient conversations. Save time on documentation and focus more on patient care.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <MicIcon color="primary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Record Visit
              </Typography>
              <Typography variant="body2">
                Record or upload doctor-patient conversations. Our advanced audio processing
                filters out background noise and enhances speech clarity for better transcription.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary" 
                fullWidth
                onClick={() => navigate('/record')}
              >
                Start Recording
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <MedicalServicesIcon color="secondary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Medical Intelligence
              </Typography>
              <Typography variant="body2">
                Our AI uses medical-specific language models to identify diagnoses,
                symptoms, medications, and procedures from conversations, organizing them
                into structured clinical summaries.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="secondary" 
                fullWidth
                onClick={() => navigate('/record')}
              >
                Generate Summary
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ListAltIcon color="primary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Manage Summaries
              </Typography>
              <Typography variant="body2">
                View, edit, and export your patient visit summaries. All data is encrypted
                and stored securely in compliance with HIPAA regulations. Easily integrate
                with your existing EHR systems.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary"
                fullWidth
                onClick={() => navigate('/summaries')}
              >
                View Summaries
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
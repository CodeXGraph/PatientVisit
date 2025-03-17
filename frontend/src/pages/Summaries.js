import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Dummy data for demonstration
const dummySummaries = [
  {
    id: '1',
    patientId: 'PT10052',
    patientName: 'John Smith',
    visitDate: '2025-03-10',
    physician: 'Dr. Sarah Johnson',
    summaryPreview: 'Patient presented with persistent cough and chest congestion for past 7 days...',
    diagnoses: ['Upper respiratory infection', 'Bronchitis'],
    medications: ['Azithromycin 250mg', 'Benzonatate 100mg']
  },
  {
    id: '2',
    patientId: 'PT10078',
    patientName: 'Emily Davis',
    visitDate: '2025-03-12',
    physician: 'Dr. Michael Chen',
    summaryPreview: 'Patient complains of severe headaches occurring 3-4 times per week...',
    diagnoses: ['Migraine', 'Dehydration'],
    medications: ['Sumatriptan 50mg', 'Excedrin Migraine']
  },
  {
    id: '3',
    patientId: 'PT10103',
    patientName: 'Robert Johnson',
    visitDate: '2025-03-13',
    physician: 'Dr. Sarah Johnson',
    summaryPreview: 'Follow-up for type 2 diabetes. Patient reports improved glucose readings...',
    diagnoses: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin 1000mg', 'Lisinopril 10mg']
  }
];

const Summaries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter summaries based on search term
  const filteredSummaries = dummySummaries.filter(summary => 
    summary.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.physician.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.summaryPreview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDialogOpen = (summary) => {
    setSelectedSummary(summary);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          borderRadius: 2,
          mb: 4,
          backgroundColor: 'background.paper' 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Patient Summaries
          </Typography>
          
          <TextField
            placeholder="Search summaries..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: '300px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        <Grid container spacing={3}>
          {filteredSummaries.length > 0 ? (
            filteredSummaries.map((summary) => (
              <Grid item xs={12} md={6} lg={4} key={summary.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        {summary.patientName}
                      </Typography>
                      <Chip 
                        label={summary.patientId} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {summary.visitDate}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {summary.physician}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                      {summary.summaryPreview}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {summary.diagnoses.map((diagnosis, index) => (
                        <Chip 
                          key={index} 
                          label={diagnosis} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleDialogOpen(summary)}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<DownloadIcon />}
                    >
                      Download
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ marginLeft: 'auto' }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No summaries found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Try a different search term' : 'Start by recording a patient visit'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Summary Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        {selectedSummary && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Patient Summary: {selectedSummary.patientName}
                </Typography>
                <IconButton aria-label="close" onClick={handleDialogClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Patient ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSummary.patientId}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Visit Date</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSummary.visitDate}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Physician</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSummary.physician}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedSummary.summaryPreview}
                    {/* This would be the full summary in a real application */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Diagnoses</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {selectedSummary.diagnoses.map((diagnosis, index) => (
                      <Chip 
                        key={index} 
                        label={diagnosis} 
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Medications</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {selectedSummary.medications.map((medication, index) => (
                      <Chip 
                        key={index} 
                        label={medication} 
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={handleDialogClose}
              >
                Download PDF
              </Button>
              <Button 
                variant="contained" 
                onClick={handleDialogClose}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Summaries;
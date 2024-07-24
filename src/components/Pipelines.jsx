import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete, Edit, ExpandMore, Add } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { supabase } from '../supabaseClient';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([]);
  const [stages, setStages] = useState([]);
  const [fields, setFields] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPipeline, setCurrentPipeline] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [dialogType, setDialogType] = useState('pipeline');
  const [formData, setFormData] = useState({
    name: '',
    type: 'textfield',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPipelines = useCallback(async () => {
    const { data, error } = await supabase.from('pipelines').select('*');
    if (error) {
      showSnackbar('Error fetching pipelines', 'error');
    } else {
      setPipelines(data);
    }
  }, []);

  const fetchStages = useCallback(async (pipelineId) => {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('pipeline_id', pipelineId);
    if (error) {
      showSnackbar('Error fetching stages', 'error');
    } else {
      setStages(data);
    }
  }, []);

  const fetchFields = useCallback(async (stageId) => {
    const { data, error } = await supabase
      .from('pipeline_fields')
      .select('*')
      .eq('stage_id', stageId);
    if (error) {
      showSnackbar('Error fetching fields', 'error');
    } else {
      setFields(data);
    }
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  useEffect(() => {
    if (currentPipeline) {
      fetchStages(currentPipeline.pipeline_id);
    }
  }, [currentPipeline, fetchStages]);

  useEffect(() => {
    if (currentStage) {
      fetchFields(currentStage.stage_id);
    }
  }, [currentStage, fetchFields]);

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setFormData({
      name: item?.name || '',
      type: item?.type || 'textfield',
    });
    setOpenDialog(true);

    if (item) {
      if (type === 'pipeline') setCurrentPipeline(item);
      else if (type === 'stage') setCurrentStage(item);
      else if (type === 'field') setCurrentField(item);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPipeline(null);
    setCurrentStage(null);
    setCurrentField(null);
    setFormData({ name: '', type: 'textfield' });
  };

  const handleFormSubmit = async () => {
    const submitFunctions = {
      pipeline: handlePipelineSubmit,
      stage: handleStageSubmit,
      field: handleFieldSubmit,
    };

    const result = await submitFunctions[dialogType]();

    if (result.error) {
      showSnackbar(`Error: ${result.error.message}`, 'error');
    } else {
      showSnackbar(`${dialogType} ${currentPipeline || currentStage || currentField ? 'updated' : 'added'} successfully`, 'success');
      handleCloseDialog();
      if (dialogType === 'pipeline') fetchPipelines();
      if (dialogType === 'stage' && currentPipeline) fetchStages(currentPipeline.pipeline_id);
      if (dialogType === 'field' && currentStage) fetchFields(currentStage.stage_id);
    }
  };

  const handlePipelineSubmit = async () => {
    const { pipeline_id } = currentPipeline || {};
    return pipeline_id
      ? await supabase.from('pipelines').update({ pipeline_name: formData.name }).eq('pipeline_id', pipeline_id)
      : await supabase.from('pipelines').insert({ pipeline_name: formData.name });
  };

  const handleStageSubmit = async () => {
    const { stage_id } = currentStage || {};
    return stage_id
      ? await supabase.from('pipeline_stages').update({ stage_name: formData.name }).eq('stage_id', stage_id)
      : await supabase.from('pipeline_stages').insert({ stage_name: formData.name, pipeline_id: currentPipeline.pipeline_id });
  };

  const handleFieldSubmit = async () => {
    const { field_id } = currentField || {};
    return field_id
      ? await supabase.from('pipeline_fields').update({ field_name: formData.name, field_type: formData.type }).eq('field_id', field_id)
      : await supabase.from('pipeline_fields').insert({ field_name: formData.name, field_type: formData.type, stage_id: currentStage.stage_id });
  };

  const handleDelete = async (type, item) => {
    const deleteOperations = {
      pipeline: { table: 'pipelines', key: 'pipeline_id', refresh: fetchPipelines },
      stage: { table: 'pipeline_stages', key: 'stage_id', refresh: () => fetchStages(currentPipeline.pipeline_id) },
      field: { table: 'pipeline_fields', key: 'field_id', refresh: () => fetchFields(currentStage.stage_id) },
    };

    const { table, key, refresh } = deleteOperations[type];
    const result = await supabase.from(table).delete().eq(key, item[key]);

    if (result.error) {
      showSnackbar(`Error deleting ${type}`, 'error');
    } else {
      showSnackbar(`${type} deleted successfully`, 'success');
      refresh();
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderPipelineContent = (pipeline) => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <IconButton onClick={() => handleOpenDialog('pipeline', pipeline)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete('pipeline', pipeline)} size="small">
            <Delete />
          </IconButton>
        </Box>
        <StyledButton
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            setCurrentPipeline(pipeline);
            handleOpenDialog('stage');
          }}
        >
          Add Stage
        </StyledButton>
      </Box>
      <List>
        {stages
          .filter((stage) => stage.pipeline_id === pipeline.pipeline_id)
          .map((stage) => renderStageAccordion(stage))}
      </List>
    </>
  );

  const renderStageAccordion = (stage) => (
    <StyledAccordion key={stage.stage_id} expanded={currentStage?.stage_id === stage.stage_id}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        onClick={() => setCurrentStage(currentStage?.stage_id === stage.stage_id ? null : stage)}
      >
        <Typography variant="subtitle1">{stage.stage_name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <IconButton onClick={() => handleOpenDialog('stage', stage)} size="small">
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete('stage', stage)} size="small">
              <Delete />
            </IconButton>
          </Box>
          <StyledButton
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              setCurrentStage(stage);
              handleOpenDialog('field');
            }}
          >
            Add Field
          </StyledButton>
        </Box>
        <List>
          {fields
            .filter((field) => field.stage_id === stage.stage_id)
            .map((field) => renderFieldListItem(field))}
        </List>
      </AccordionDetails>
    </StyledAccordion>
  );

  const renderFieldListItem = (field) => (
    <ListItem key={field.field_id}>
      <ListItemText primary={field.field_name} secondary={`Type: ${field.field_type}`} />
      <ListItemSecondaryAction>
        <IconButton onClick={() => handleOpenDialog('field', field)} size="small">
          <Edit />
        </IconButton>
        <IconButton onClick={() => handleDelete('field', field)} size="small">
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pipelines
        </Typography>
        <List>
          {pipelines.map((pipeline) => (
            <StyledAccordion key={pipeline.pipeline_id} expanded={currentPipeline?.pipeline_id === pipeline.pipeline_id}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                onClick={() => setCurrentPipeline(currentPipeline?.pipeline_id === pipeline.pipeline_id ? null : pipeline)}
              >
                <Typography variant="h6">{pipeline.pipeline_name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderPipelineContent(pipeline)}
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </List>
        <Box mt={2}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('pipeline')}>
            Add Pipeline
          </Button>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentPipeline || currentStage || currentField ? 'Edit' : 'Add'} {dialogType}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          {dialogType === 'field' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
              >
                <MenuItem value="textfield">Textfield</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="file">File</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Pipelines;
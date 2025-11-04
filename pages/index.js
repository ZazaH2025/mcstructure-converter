/**
 * MCStructure Converter Page
 * 
 * This is the main page of the application that converts between:
 * 1. .mcstructure files (Minecraft Bedrock Edition binary format) → JSON
 * 2. JSON → .mcstructure files
 * 
 * Features:
 * - Drag-and-drop file upload with visual feedback
 * - Converts NBT (Named Binary Tag) binary data to readable JSON
 * - Allows editing JSON in the preview textarea
 * - Generates downloadable .mcstructure files from JSON
 * - Special handling for level.dat files with 8-byte headers
 * - JSON formatting and clipboard copy functions
 */

import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import * as nbt from 'prismarine-nbt';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from '../src/snackbar/Snackbar';
import Header from './Header';
import { writeStructure } from '../src/nbt';

import { Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Card, CardContent, Box, Chip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FormatIcon from '@mui/icons-material/FormatAlignLeftSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Styles for drag-and-drop zone states
const borderNormalStyle = {};
const borderDragStyle = {
  border: "3px dashed #4CAF50",
  backgroundColor: 'rgba(76, 175, 80, 0.05)',
  transform: 'scale(1.02)',
  transition: 'all .3s ease'
};

/**
 * Home Component - Main Converter Page
 */
export default function Home() {
  const [ selection, setSelection ] = React.useState('structure');
  const [ fileName, setFileName ] = React.useState('generated.mcstructure');
  const [ isError, setError ] = React.useState(false);
  const [ isLevelDatMode, setLevelDatMode ] = React.useState(false);
  const { showSnackbar } = useSnackbar();
  
  const handleCopy = () => {
    const text = document.getElementById('preview').value;
    if (text) navigator.clipboard.writeText(text);
    showSnackbar(
      text ? 'Copied to clipboard!' : 'There is nothing to copy!',
      text ? 'success' : 'warning'
    );
  };
  
  const handleSelect = (ev) => setSelection(ev.target.value);
  
  const handleGenerate = () => {
    try {
      generateStructure(selection, isLevelDatMode);
      showSnackbar('File generated successfully!', 'success');
    } catch(e) {
      showSnackbar(String(e), 'error');
    }
  }
  
  const loadSuccess = (fileName) => {
    showSnackbar(`Successfully loaded ${fileName}`, 'success');
    setFileName(fileName);
  }
  
  const loadStructure = async (data, fileName) => {
    const preview = document.getElementById('preview');
    try {
      const { parsed } = await nbt.parse(Buffer.from(data));
      preview.value = JSON.stringify(parsed, null, 2);
      setError(false);
      loadSuccess(fileName);
    } catch(e) {
      preview.value = '';
      setError(true);
      showSnackbar(String(e), 'error');
    }
  }
  
  const loadText = (data, fileName) => {
    document.getElementById('preview').value = data;
    setError(false);
    loadSuccess(fileName);
  }
  
  const updatePreview = (file) => {
    const reader = new FileReader();
    if (!file) return;
    
    if (selection === 'structure') {
      reader.addEventListener('load', () => loadStructure(reader.result, file.name));
      reader.readAsArrayBuffer(file);
      if (file.name === 'level.dat' || file.name === 'level.dat_old') setLevelDatMode(true);
      
    } else if (selection === 'json') {
      reader.addEventListener('load', () => loadText(reader.result, file.name));
      reader.readAsText(file);
      
    } else {
      showSnackbar(`Received unexpected type: ${selection}`, 'error');
    }
  }
  
  const formatPreview = () => {
    const preview = document.getElementById('preview');
    if (selection === 'structure' || selection === 'json') {
      try {
        preview.value = JSON.stringify(JSON.parse(preview.value), null, 2);
        showSnackbar('JSON formatted successfully!', 'success');
      } catch {
        showSnackbar('ParseError: Failed to parse JSON in preview', 'error');
      }
    }
  }
  
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, open } = useDropzone({
    multiple: false,
    noClick: true
  });
  
  React.useEffect(() => updatePreview(acceptedFiles[0]), [acceptedFiles, selection]);
  
  const dropZoneStyle = React.useMemo(() => (
    { ...(isDragActive ? borderDragStyle : borderNormalStyle) }
  ), [isDragActive]);

  const LevelDatCheckBox = () => (
    <Checkbox size="small" onChange={(e) => setLevelDatMode(e.target.checked)} checked={isLevelDatMode} />
  );
  
  const TypeSelector = React.memo(function Selector() {
    return (
      <FormControl>
        <FormLabel sx={{ fontWeight: 600, color: '#333', mb: 1 }}>Input Type</FormLabel>
        <RadioGroup defaultValue="structure" value={selection} onChange={handleSelect} id="select" row>
          <FormControlLabel 
            value="structure" 
            control={<Radio/>} 
            label={<span style={{ fontWeight: 500 }}>Structure File</span>}
          />
          <FormControlLabel 
            value="json" 
            control={<Radio/>} 
            label={<span style={{ fontWeight: 500 }}>JSON</span>} 
          />
        </RadioGroup>
        <FormGroup>
          <FormControlLabel 
            control={<LevelDatCheckBox />} 
            label={<span style={{ fontSize: '0.9rem' }}>level.dat mode (adds 8-byte header)</span>}
          />
        </FormGroup>
      </FormControl>
    )
  }, [selection]);
    
  const GenerateButton = () => (
    <Button 
      variant="contained" 
      onClick={handleGenerate} 
      startIcon={<IosShareIcon/>} 
      size="large"
      sx={{ mt: 2 }}
    >
      Generate & Download
    </Button>
  );
  
  return (
    <>
      <Head>
        <title>MCStructure Converter - Minecraft Bedrock Edition Tool</title>
        <meta name="description" content="Convert .mcstructure files into JSON that you can easily edit. Free online Minecraft Bedrock Edition structure converter." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      
      <Header name="MCStructure Converter" pageId="converter"/>
      
      <main className={styles.main}>
        
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Chip 
            label="Minecraft Bedrock Edition" 
            color="primary" 
            sx={{ mb: 2, fontSize: '0.9rem', fontWeight: 600 }}
          />
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Convert Minecraft structure files to editable JSON format and back. 
            Perfect for content creators and world builders!
          </Typography>
        </Box>

        {/* File Upload Card */}
        <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 3 }}>
            <div className={styles.label}>
              <CloudUploadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Select File
            </div>
            
            <Box 
              {...getRootProps({ style: dropZoneStyle })} 
              className={styles.fieldset}
              sx={{ mx: 'auto' }}
            >
              <div>
                { isDragActive ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 1 }} />
                    <Typography variant="h6" color="primary">
                      Drop the file here!
                    </Typography>
                  </Box>
                ) : (
                  <TypeSelector />
                )}
                <input {...getInputProps()} />
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<FileOpenIcon/>} 
                    onClick={open}
                    size="large"
                  >
                    Choose File
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    or drag and drop your file here
                  </Typography>
                </Box>
              </div>
            </Box>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <div className={styles.label}>📝 Preview & Edit</div>
            
            <textarea 
              id="preview" 
              className={`${styles.textarea} ${isError ? styles.error : ''}`}
              placeholder="Your JSON data will appear here. You can edit it before generating the structure file."
            ></textarea>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={handleCopy} 
                startIcon={<ContentCopyIcon/>}
              >
                Copy
              </Button>
              <Button 
                variant="contained" 
                onClick={formatPreview} 
                startIcon={<FormatIcon/>}
              >
                Format
              </Button>
              <Button 
                variant="outlined" 
                onClick={clearPreview} 
                startIcon={<DeleteIcon/>}
                sx={{ ml: 'auto' }}
              >
                Clear
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Generate Card */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <div className={styles.label}>💾 Generate File</div>
            
            <Box className={styles.form}>
              <FileNameEdit 
                value={fileName} 
                onChange={(e) => setFileName(e.target.value)} 
              />
              <GenerateButton/>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Made for Minecraft content creators |{' '}
            <a href="https://github.com/tutinoko2048/mcstructure-converter" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Typography>
        </Box>
      
      </main>
    </>
  )
}

const FileNameEdit = (props) => (
  <TextField 
    id="fileName" 
    label="Output Filename" 
    variant="outlined" 
    fullWidth
    value={props.value} 
    onChange={props.onChange}
    sx={{ mb: 1 }}
  />
)

function clearPreview() {
  document.getElementById('preview').value = '';
}

function generateStructure(selection, isLevelDat) {
  const data = document.getElementById('preview').value;
  if (!data) throw Error('Please put valid JSON in the preview area');
  const url = writeStructure(JSON.parse(data), selection, isLevelDat);
  const a = document.createElement('a');
  a.href = url;
  a.download = document.getElementById('fileName').value;
  a.click();
}

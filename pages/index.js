/**
 * MCStructure Converter Page
 * 
 * This is the main page of the application that converts between:
 * 1. .mcstructure files (Minecraft Bedrock Edition binary format) → JSON
 * 2. JSON → .mcstructure files
 * 
 * Features:
 * - Drag-and-drop file upload
 * - Converts NBT (Named Binary Tag) binary data to readable JSON
 * - Allows editing JSON in the preview textarea
 * - Generates downloadable .mcstructure files from JSON
 * - Special handling for level.dat files with 8-byte headers
 * - JSON formatting and clipboard copy functions
 * 
 * The converter is bidirectional, allowing Minecraft content creators to:
 * - Export structures to JSON for easy editing
 * - Import modified JSON back to .mcstructure format
 */

import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import * as nbt from 'prismarine-nbt';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from '../src/snackbar/Snackbar';
import Header from './Header';
import { writeStructure } from '../src/nbt';

import { Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, ToggleButton, Checkbox, FormGroup } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IosShareIcon from '@mui/icons-material/IosShare';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FormatIcon from '@mui/icons-material/FormatAlignLeftSharp';
import DeleteIcon from '@mui/icons-material/Delete';

// Styles for drag-and-drop zone states
const borderNormalStyle = {};
const borderDragStyle = {
  border: "1px solid #00f",                // Blue border when dragging
  transition: 'border .2s ease-in-out'     // Smooth transition animation
};

/**
 * Home Component - Main Converter Page
 * 
 * Manages the entire conversion workflow:
 * - File upload via drag-and-drop or file picker
 * - Parsing binary .mcstructure files to JSON
 * - Displaying and editing JSON in textarea
 * - Converting JSON back to .mcstructure format
 */
export default function Home() {
  // State: Current input type ('structure' for .mcstructure, 'json' for JSON files)
  const [ selection, setSelection ] = React.useState('structure');
  
  // State: Name for the generated output file
  const [ fileName, setFileName ] = React.useState('generated.mcstructure');
  
  // State: Whether there's a parsing error (shows red border on textarea)
  const [ isError, setError ] = React.useState(false);
  
  // State: Whether to add level.dat header (8 extra bytes for level files)
  const [ isLevelDatMode, setLevelDatMode ] = React.useState(false);
  
  // Get snackbar function for showing notifications
  const { showSnackbar } = useSnackbar();
  
  /**
   * Copies the preview textarea content to clipboard
   * Shows success or warning notification based on whether there's content
   */
  const handleCopy = () => {
    const text = document.getElementById('preview').value;
    if (text) navigator.clipboard.writeText(text);
    showSnackbar(
      text ? 'Copied!' : 'There is nothing to copy!',
      text ? 'info' : 'warning'
    );
  };
  
  /**
   * Handles input type selection (structure or JSON)
   * @param {Event} ev - Radio button change event
   */
  const handleSelect = (ev) => setSelection(ev.target.value);
  
  /**
   * Triggers the structure generation process
   * Converts JSON from preview to .mcstructure and downloads it
   */
  const handleGenerate = () => {
    try {
      generateStructure(selection, isLevelDatMode);
    } catch(e) {
      showSnackbar(String(e), 'error');
    }
  }
  
  /**
   * Shows success notification when file loads successfully
   * @param {string} fileName - Name of the loaded file
   */
  const loadSuccess = (fileName) => {
    showSnackbar(`Successfully loaded ${fileName}`, 'success');
    setFileName(fileName);
  }
  
  /**
   * Loads and parses a .mcstructure (NBT binary) file
   * 
   * Converts the binary NBT data to JSON and displays it in the preview.
   * Automatically enables level.dat mode if the filename is level.dat.
   * 
   * @param {ArrayBuffer} data - Binary file data
   * @param {string} fileName - Name of the uploaded file
   */
  const loadStructure = async (data, fileName) => {
    const preview = document.getElementById('preview');
    try {
      // Parse NBT binary data (little-endian for Bedrock Edition)
      const { parsed } = await nbt.parse(Buffer.from(data));
      
      // Convert parsed NBT to formatted JSON for editing
      preview.value = JSON.stringify(parsed, null, 2);
      setError(false);
      loadSuccess(fileName);
    } catch(e) {
      // Show error if parsing fails (invalid file or corrupted data)
      preview.value = '';
      setError(true);
      showSnackbar(String(e), 'error');
    }
  }
  
  /**
   * Loads a text/JSON file directly into the preview
   * 
   * @param {string} data - Text content of the file
   * @param {string} fileName - Name of the uploaded file
   */
  const loadText = (data, fileName) => {
    document.getElementById('preview').value = data;
    setError(false);
    loadSuccess(fileName);
  }
  
  /**
   * Processes uploaded file based on selected input type
   * 
   * Reads the file and calls appropriate loader:
   * - structure: Reads as binary and parses NBT
   * - json: Reads as text and displays directly
   * 
   * @param {File} file - The uploaded file object
   */
  const updatePreview = (file) => {
    const reader = new FileReader();
    if (!file) return;
    
    if (selection === 'structure') {
      // Read binary .mcstructure file
      reader.addEventListener('load', () => loadStructure(reader.result, file.name));
      reader.readAsArrayBuffer(file);
      
      // Auto-enable level.dat mode for level files
      if (file.name === 'level.dat' || file.name === 'level.dat_old') setLevelDatMode(true);
      
    } else if (selection === 'json') {
      // Read text JSON file
      reader.addEventListener('load', () => loadText(reader.result, file.name));
      reader.readAsText(file);
      
    } else {
      showSnackbar(`Received unexpected type: ${selection}`, 'error');
    }
  }
  
  /**
   * Formats the JSON in the preview textarea
   * 
   * Parses and re-stringifies JSON with proper indentation.
   * Shows error if JSON is invalid.
   */
  const formatPreview = () => {
    const preview = document.getElementById('preview');
    if (selection === 'structure' || selection === 'json') {
      try {
        // Parse and re-format with 2-space indentation
        preview.value = JSON.stringify(JSON.parse(preview.value), null, 2);
        showSnackbar('Formatted!', 'success');
      } catch {
        showSnackbar('ParseError: failed to parse JSON in preview', 'error');
      }
    }
  }
  
  // Set up drag-and-drop file upload
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, open } = useDropzone({
    multiple: false,      // Only accept one file at a time
    noClick: true         // Don't open file picker on click (use button instead)
  });
  
  // Update preview when a new file is dropped or selected
  // eslint-disable-next-line
  React.useEffect(() => updatePreview(acceptedFiles[0]), [acceptedFiles, selection]);
  
  // Apply drag styling when file is being dragged over the drop zone
  const dropZoneStyle = React.useMemo(() => (
    { ...(isDragActive ? borderDragStyle : borderNormalStyle) }
  ), [isDragActive]);

  /**
   * Checkbox for level.dat mode
   * When enabled, adds 8-byte header to generated files
   */
  const LevelDatCheckBox = () => (
    <Checkbox size="small" onChange={(e) => setLevelDatMode(e.target.checked)} checked={isLevelDatMode} />
  );
  
  /**
   * Type Selector Component
   * Radio buttons to choose input type: structure or JSON
   */
  const TypeSelector = React.memo(function Selector() {
    return (
      <FormControl>
        <FormLabel>Input Type</FormLabel>
        <RadioGroup defaultValue="structure" value={selection} onChange={handleSelect} id="select" row>
          <FormControlLabel value="structure" control={<Radio/>} label="structure"/>
          <FormControlLabel value="json" control={<Radio/>} label="JSON" />
        </RadioGroup>
        <FormGroup>
          <FormControlLabel control={<LevelDatCheckBox />} label="level.dat mode"/>
        </FormGroup>
      </FormControl>
    )
  }, [selection]);
    
  /**
   * Generate Button Component
   * Triggers conversion from JSON to .mcstructure and downloads result
   */
  const GenerateButton = () => (
    <Button variant="contained" onClick={handleGenerate} startIcon={<IosShareIcon/>} style={{ marginTop: '0.5rem'}}>
      Generate
    </Button>
  );
  
  return (
    <>
      <Head>
        <title>mcstructure converter</title>
        <meta name="description" content="Converts .mcstructure file into JSON that you can easily edit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      
      {/* Page header with navigation */}
      <Header name="mcstructure converter" pageId="converter"/>
      
      <main className={styles.main}>

      {/* File Upload Section */}
      <div className={styles.label}>Select file</div><br/>  
      <fieldset className={styles.fieldset} {...getRootProps({ style: dropZoneStyle })} >
        <div >
          {/* Show drop message when dragging, otherwise show type selector */}
          { isDragActive ? <p>Drop the files here ...</p> : <TypeSelector /> }
          <input {...getInputProps()} />
          
          {/* Button to open file picker */}
          <Button variant="contained" component="label" startIcon={<FileOpenIcon/>} onClick={open}>
            Select
          </Button><br/>
        </div>
      </fieldset><br/>

      {/* Preview/Edit Section */}
      <div className={styles.label}>Preview</div><br/>
      {/* Textarea for viewing/editing JSON. Red border if there's an error */}
      <textarea id="preview" className={`${styles.textarea} ${isError ? styles.error : ''}`}></textarea><br/>
      
      {/* Preview control buttons */}
      <Button variant="contained" onClick={handleCopy} startIcon={<ContentCopyIcon/>}>
        Copy
      </Button>
      <Button variant="contained" onClick={formatPreview} style={{ marginLeft: '0.5rem' }} startIcon={<FormatIcon/>}>
        Format
      </Button>
      <Button variant="contained" onClick={clearPreview} style={{ float: 'right' }} color="inherit" startIcon={<DeleteIcon/>}>
        Clear
      </Button>
      <br/>
      <br/>
      
      {/* Generate Section */}
      <fieldset className={styles.fieldset} id="result">
        <div className={styles.form}>
          {/* Input field for output filename */}
          <FileNameEdit value={fileName} onChange={(e) => setFileName(e.target.value)} /><br/>
          <GenerateButton/>
        </div>
      </fieldset><br/>
      <br/>
      
      {/* Link to GitHub repository */}
      <a href="https://github.com/tutinoko2048/mcstructure-converter">Github</a>
      
      </main>
    </>
  )
}

/**
 * FileNameEdit Component
 * Text field for entering the output filename
 * 
 * @param {Object} props
 * @param {string} props.value - Current filename
 * @param {Function} props.onChange - Callback when filename changes
 */
const FileNameEdit = (props) => (
  <TextField id="fileName" label="File name" variant="outlined" size="small" value={props.value} onChange={props.onChange} />
)

/**
 * Clears the preview textarea
 * Helper function to empty the preview content
 */
function clearPreview() {
  document.getElementById('preview').value = '';
}

/**
 * Generates .mcstructure file from JSON and downloads it
 * 
 * Takes the JSON from the preview, converts it to NBT binary format,
 * and triggers a browser download with the specified filename.
 * 
 * @param {string} selection - Input type (used for mode parameter)
 * @param {boolean} isLevelDat - Whether to add level.dat header
 * @throws {Error} If JSON is invalid or preview is empty
 */
function generateStructure(selection, isLevelDat) {
  const data = document.getElementById('preview').value;
  if (!data) throw Error('Please put valid JSON');
  
  // Parse JSON and convert to binary .mcstructure format
  const url = writeStructure(JSON.parse(data), selection, isLevelDat);
  
  // Create temporary download link and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = document.getElementById('fileName').value;
  a.click();
}

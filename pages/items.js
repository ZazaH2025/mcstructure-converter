/**
 * Item Generator Page
 * 
 * This page allows users to create custom Minecraft items with advanced properties:
 * - Custom item names and IDs
 * - Custom display names (shown in game)
 * - Lore text (description lines shown when hovering over item)
 * - Enchantments with custom levels
 * - Unbreakable flag
 * 
 * Items are arranged in a chest structure (max 27 items) and can be exported as:
 * 1. .mcstructure file (placeable in Minecraft world)
 * 2. JSON file (for further editing)
 * 
 * The generated structure contains a chest with all the custom items inside,
 * ready to be placed in a Minecraft Bedrock Edition world.
 */

import React from 'react';
import Head from 'next/head';
import Header from './Header';
import * as nbt from 'prismarine-nbt';
import { createItem, createEnchant, EnchantmentTypes, writeStructure } from '../src/nbt';
import template from '../src/chest_structure.json';
import { Divider, List, IconButton, Button, TextField as MuiTextField, Typography, Switch, Select, MenuItem } from '@mui/material';
import { Accordion, AccordionSummary } from '../src/components/Accordion';
import { useSnackbar } from '../src/snackbar/Snackbar';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";

// Maximum number of items that can fit in a Minecraft chest
const MAX_COUNT = 27;

/**
 * Styling constants for the page components
 * Using Material-UI's sx prop format
 */
const styles = {
  viewer: { paddingLeft: '1.2em' },          // Debug tree view indentation
  item: {
    bgcolor: 'background.paper',             // Accordion background
    width: '40em',                           // Accordion width
    maxWidth: '95%'                          // Responsive max width
  },
  itemTitle: {
    display: 'table-cell',                   // Table cell for vertical centering
    verticalAlign: 'middle',
    fontWeight: 'bold',
    fontSize: '1.1em'
  },
  right: { flexGrow: 1 },                    // Spacer for right-aligned elements
  select: { minWidth: '30%',  marginRight: '0.5em' },
  grid: { margin: 'auto'},
  'export': { textTransform: 'none', marginTop: '0.8em' }
}

/**
 * Custom TextField Component
 * Wraps Material-UI TextField with default styling
 */
const TextField = (props) => (
  <MuiTextField variant="outlined" size="small" {...props} sx={{ width: '18em', maxWidth: '95%'}} />
);

/**
 * Number Input Field Component
 * 
 * Only allows numeric input and converts string to number.
 * Sets null if input is empty or invalid.
 * 
 * @param {Object} props
 * @param {Function} props.onChange - Callback with parsed number or null
 */
const NumberField = (props) => {
  const handleChange = (e) => {
    if (e.target.value === '') return props.onChange(null);
    if (isNaN(e.target.value)) {
      props.onChange(null)
    } else {
      props.onChange(Number(e.target.value));
    }
  }
  return <TextField {...props} onChange={handleChange} inputProps={{
    inputMode: "numeric",      // Show numeric keyboard on mobile
    pattern: "[0-9]*"          // HTML5 numeric pattern
  }}/>
}

/**
 * Simple Label Component
 * Used for form field labels
 */
const PreviewLabel = ({ value }) => (
  <span style={{ flexDirection: 'column' }}>{value}</span>
)

/**
 * ItemGenerator Component - Main Page
 * 
 * Manages a list of custom items displayed in accordion panels.
 * Each item can be configured with various properties and enchantments.
 */
export default function ItemGenerator() {
  // Extract the items array reference from the chest structure template
  const { block_entity_data } = template.value.structure.value.palette.value.default.value.block_position_data.value[0].value;
  const itemList = block_entity_data.value.Items.value;
  
  const { showSnackbar } = useSnackbar();
  
  // State: Currently expanded accordion index (false = all collapsed)
  const [ expand, setExpand ] = React.useState(false);
  
  // State: Array of item NBT structures
  const [ items, setItems ] = React.useState([ createItem('minecraft:diamond') ]);
  
  /**
   * Syncs the items state to the template structure
   * Called before exporting to ensure template has latest data
   */
  const updateList = () => itemList.value = items;
  
  /**
   * Adds a new empty item to the list
   * Shows error if chest is already full (27 items max)
   */
  const addItem = () => {
    if (items.length >= MAX_COUNT) return showSnackbar(`The max size of container is ${MAX_COUNT}`, 'error');
    const newList = [...items, createItem()];
    setItems(newList);
    
    // Auto-expand the newly added item
    setExpand(newList.length - 1);
  }
  
  /**
   * Toggles accordion expansion for an item
   * @param {number} i - Index of the item to expand/collapse
   */
  const handleExpand = (i) => {
    if (expand === i) return setExpand(false);  // Collapse if already expanded
    setExpand(i);
  }
  
  /**
   * Removes an item from the list
   * @param {Event} e - Click event
   * @param {number} index - Index of item to delete
   */
  const deleteItem = (e, index) => {
    e.stopPropagation();  // Prevent accordion from toggling
    items.splice(index, 1);
    setItems([...items]);
  }
  
  /**
   * Updates a specific property of an item
   * 
   * @param {any} value - New value for the property
   * @param {string} id - Property identifier ('id', 'name', 'unbreakable')
   * @param {number} index - Index of the item to update
   */
  const changeValue = (value, id, index) => {
    if (id === 'id') items[index].Name.value = value;
    if (id === 'name') items[index].tag.value.display.value.Name = value ? nbt.string(value) : undefined;
    if (id === 'unbreakable') items[index].tag.value.Unbreakable = value ? nbt.byte(value) : undefined;
    
    setItems([...items]);
  }
  
  /**
   * Updates the lore (description) of an item
   * Lore is an array of strings shown when hovering over the item in game
   * 
   * @param {string[]} lores - Array of lore text lines
   * @param {number} i - Index of the item
   */
  const changeLore = (lores, i) => {
    items[i].tag.value.display.value.Lore = lores.length ? nbt.list(nbt.string(lores)) : undefined;
    setItems([...items]);
  }
  
  /**
   * Updates the enchantments of an item
   * 
   * @param {Object[]} enchants - Array of enchantment NBT compounds
   * @param {number} i - Index of the item
   */
  const changeEnchant = (enchants, i) => {
    items[i].tag.value.ench = enchants.length ? nbt.list(nbt.comp(enchants)) : undefined;
    setItems([...items]);
  }
  
  /**
   * Updates item slot positions when items are added/removed
   * Ensures each item has the correct inventory slot number (0-26)
   */
  React.useEffect(() => {
    setItems(items.map((item, i) => {
      item.Slot.value = i;
      return item;
    }));
  }, [ items.length ])
  
  /**
   * Creates the accordion panels for all items
   * Each panel contains form fields for item properties
   * 
   * @returns {JSX.Element[]} Array of Accordion components
   */
  const createPanel = () => {
    return items.map((item, i) => {
      // Extract current values from item NBT structure
      const itemId = item.Name.value;
      const itemName = item.tag.value.display.value.Name?.value ?? '';
      const itemLore = item.tag.value.display.value.Lore?.value?.value ?? [];
      const itemEnchant = item.tag.value.ench?.value?.value ?? [];
      const isUnbreakable = item.tag.value.Unbreakable?.value;
      
      return (
        <Accordion key={i} sx={styles.item} expanded={expand === i} onChange={() => handleExpand(i)}>
          {/* Accordion Header - Shows item ID and delete button */}
          <AccordionSummary>
            <div style={{ display: 'table', paddingLeft: '0.4em' }}>
              <Typography style={styles.itemTitle}>{itemId || '-'}</Typography>
            </div>
            <br/>
            <div style={styles.right}/>
            <IconButton size="small" onClick={(e) => deleteItem(e, i)}><CloseIcon/></IconButton>
          </AccordionSummary>
          
          {/* Accordion Content - Item configuration form */}
          <div style={{ margin: '0.8em'}}>
          
            {/* Item Identifier (e.g., minecraft:diamond_sword) */}
            <PreviewLabel value="Identifier:"/>
            <TextField value={itemId} style={{ marginLeft: '1em' }}
              onChange={(e) => changeValue(e.target.value, 'id', i)}
            /><br/>
            
            {/* Custom Display Name (shown in game instead of default name) */}
            <PreviewLabel value="Name:"/>
            <TextField value={itemName} style={{ marginLeft: '1em' }}
              onChange={(e) => changeValue(e.target.value, 'name', i)}
            /><br/>
            
            {/* Lore Section - Multiple lines of description text */}
            <PreviewLabel value="Lore:"/>
            <IconButton onClick={() => {
              itemLore.push('');
              changeLore(itemLore, i);
            }}><AddIcon/></IconButton><br/>
            
            {/* Map through lore lines */}
            {...itemLore.map((lore, loreIndex) => (
              <div key={loreIndex} style={{ marginBottom: '0.5em' }}>
                <div style={{ display: 'flex' }}>
                  {/* Lore text input */}
                  <TextField multiline style={{ marginLeft: '1em', width: '25em' }} value={lore} onChange={(e) => {
                    itemLore[loreIndex] = e.target.value;
                    changeLore(itemLore, i);
                  }}/>
                  {/* Remove lore line button */}
                  <IconButton onClick={() => {
                    itemLore.splice(loreIndex, 1);
                    changeLore(itemLore, i);
                  }}>
                    <CloseIcon/>
                  </IconButton>
                </div>
              </div>
            ))}

            {/* Enchantments Section */}
            {/* eslint-disable-next-line */}
            <PreviewLabel value="Enchantments:"/>
            <IconButton onClick={() => {
              itemEnchant.push(createEnchant());
              changeEnchant(itemEnchant, i);
            }}><AddIcon/></IconButton>
            
            {/* Map through enchantments */}
            {...itemEnchant.map((enchant, enchIndex) => (
              <div key={enchIndex} style={{ marginLeft: '1em', marginBottom: '0.5em' }}>
                <div>
                  ID: {enchant.id.value ?? '-'}, Level: {enchant.lvl.value ?? '-'}
                </div>
                <div style={{ display: 'flex' }}>
                  {/* Enchantment type selector dropdown */}
                  <Select value={enchant.id.value} style={styles.select} size="small" MenuProps={{ style: { height: '50%' }}} onChange={(e) => {
                    enchant.id.value = Number(e.target.value);
                    changeEnchant(itemEnchant, i);
                  }}>
                    {/* List all available enchantments */}
                    {...Object.keys(EnchantmentTypes).map(enchId => (
                      <MenuItem key={enchId} value={enchId}>{EnchantmentTypes[enchId]}</MenuItem>
                    ))}
                  </Select>
                  
                  {/* Enchantment level input */}
                  <NumberField value={enchant.lvl.value} style={{ width: '6em' }} onChange={(value) => {
                    enchant.lvl.value = value;
                    changeEnchant(itemEnchant, i);
                  }}/>
                  
                  {/* Remove enchantment button */}
                  <IconButton onClick={() => {
                    itemEnchant.splice(enchIndex, 1);
                    changeEnchant(itemEnchant, i);
                  }}>
                    <CloseIcon/>
                  </IconButton>
                </div>
              </div>
            ))}
            <br/>
            
            {/* Unbreakable Toggle - Item never loses durability */}
            {/* eslint-disable-next-line */}
            <PreviewLabel value="Unbreakable"/>
            <Switch value={isUnbreakable}
              onChange={(e) => changeValue(e.target.checked ? 1 : 0, 'unbreakable', i)}
            />
            
          </div>
        </Accordion>
      )
    })
  }
  
  return (
    <>
    <Head>
      <title>Item Generator</title>
      <meta name="description" content="Generates customized item with mcstructure" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
    {/* Page header with navigation */}
    <Header name="Item Generator" pageId="items" />
    
    <main style={{ marginLeft: '1em' }}>
      
      {/* Item count display */}
      Items ({items.length}/{MAX_COUNT})<br/>
      
      {/* List of item accordions */}
      <List >
        {...createPanel()}
      </List>
      
      {/* Add new item button */}
      <Button startIcon={<AddIcon/>} variant="contained" onClick={addItem}
        sx={{ float: 'right', marginRight: '1em' }}
      >
        Add item
      </Button><br/>
      <br/>
      
      <Divider/>
      <br/>
      
      {/* Export Section */}
      Name:<br/>
      <TextField id="fileName" defaultValue="export"/><br/>
      
      {/* Export as .mcstructure file (chest with items) */}
      <Button style={styles.export} variant="contained" size="small" onClick={() => {
        updateList();
        exportStructure(JSON.parse(JSON.stringify(template))); // delete undefined
      }}>Export as structure</Button><br/>

      {/* Export as JSON file for manual editing */}
      <Button style={styles.export} variant="contained" size="small" onClick={() => {
        updateList();
        exportJson(template);
      }}>Export as JSON</Button><br/>
        
      <br/>
      <Divider/>
      
      {/* Debug Section - Shows raw NBT structure as tree */}
      <br/>
      <h4>Debug view</h4>
      
      <div id="debug"></div>
      {generateTree(items)}
      <br/>
      
      {/* Link to GitHub repository */}
      <a href="https://github.com/tutinoko2048/mcstructure-converter">Github</a>
      <br/>
    </main>
    </>
  )
}

/**
 * Exports items as a .mcstructure file
 * 
 * Converts the chest structure with items to NBT binary format
 * and triggers browser download.
 * 
 * @param {Object} data - Chest structure template with items
 */
function exportStructure(data) {
  try {
    const fileName = document.getElementById('fileName');
    const a = document.createElement('a');
    a.href = writeStructure(data);
    a.download = `${fileName.value}.mcstructure`;
    a.click();
  } catch (e) {
    alert(String(e));
  }
}

/**
 * Exports items as a JSON file
 * 
 * Saves the entire chest structure as formatted JSON
 * for manual editing or backup.
 * 
 * @param {Object} data - Chest structure template with items
 */
function exportJson(data) {
  const fileName = document.getElementById('fileName');
  const blob = new Blob([ JSON.stringify(data, null, 2) ]);
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = `${fileName.value}.json`;
  a.click();
}

/**
 * Recursively generates a tree view of an object
 * 
 * Used in the debug section to visualize the NBT structure.
 * Shows nested objects and their properties in an expandable tree.
 * 
 * @param {Object} obj - Object to visualize
 * @returns {JSX.Element} Unordered list tree structure
 */
function generateTree(obj) {
  return (
    <ul style={styles.viewer}>
      {...Object.keys(obj).map(k => {
        // Recursively render nested objects
        if (isObject(obj[k])) return <li key={k} >{k}: {generateTree(obj[k])}</li>
        
        // Render primitive values (undefined shown in gray)
        return <li
          key={k}
          style={obj[k] === undefined ? { color: 'darkgray' } : null}>
            {k}: {typeView(obj[k])}
          </li>
      })}
    </ul>
  )
}

/**
 * Formats a value for display in the debug tree
 * 
 * Wraps strings in quotes, converts other types to string
 * 
 * @param {any} value - Value to format
 * @returns {string} Formatted value string
 */
function typeView(value) {
  return typeof value === 'string' ? `"${value}"` : String(value);
}

/**
 * Checks if a value is an object (not null, not array)
 * 
 * @param {any} item - Value to check
 * @returns {boolean} True if item is an object
 */
function isObject(item) {
  return item && typeof item === 'object';
}

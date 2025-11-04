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
 */

import React from 'react';
import Head from 'next/head';
import Header from './Header';
import * as nbt from 'prismarine-nbt';
import { createItem, createEnchant, EnchantmentTypes, writeStructure } from '../src/nbt';
import template from '../src/chest_structure.json';
import { Divider, List, IconButton, Button, TextField as MuiTextField, Typography, Switch, Select, MenuItem, Card, CardContent, Box, Chip, Paper } from '@mui/material';
import { Accordion, AccordionSummary } from '../src/components/Accordion';
import { useSnackbar } from '../src/snackbar/Snackbar';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';
import InventoryIcon from '@mui/icons-material/Inventory';

const MAX_COUNT = 27;

const styles = {
  viewer: { paddingLeft: '1.2em' },
  item: {
    bgcolor: 'background.paper',
    width: '100%',
    maxWidth: '900px',
    mb: 1,
  },
  itemTitle: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontWeight: 600,
    fontSize: '1.1em',
    color: '#333',
  },
  right: { flexGrow: 1 },
  select: { minWidth: '30%',  marginRight: '0.5em' },
  grid: { margin: 'auto'},
  'export': { textTransform: 'none', marginTop: '0.8em' }
}

const TextField = (props) => (
  <MuiTextField variant="outlined" size="small" {...props} sx={{ width: '18em', maxWidth: '95%', ...props.sx}} />
);

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
    inputMode: "numeric",
    pattern: "[0-9]*"
  }}/>
}

const PreviewLabel = ({ value }) => (
  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.5 }}>
    {value}
  </Typography>
)

export default function ItemGenerator() {
  const { block_entity_data } = template.value.structure.value.palette.value.default.value.block_position_data.value[0].value;
  const itemList = block_entity_data.value.Items.value;
  
  const { showSnackbar } = useSnackbar();
  const [ expand, setExpand ] = React.useState(false);
  const [ items, setItems ] = React.useState([ createItem('minecraft:diamond') ]);
  
  const updateList = () => itemList.value = items;
  
  const addItem = () => {
    if (items.length >= MAX_COUNT) return showSnackbar(`The max size of container is ${MAX_COUNT}`, 'error');
    const newList = [...items, createItem()];
    setItems(newList);
    setExpand(newList.length - 1);
  }
  
  const handleExpand = (i) => {
    if (expand === i) return setExpand(false);
    setExpand(i);
  }
  
  const deleteItem = (e, index) => {
    e.stopPropagation();
    items.splice(index, 1);
    setItems([...items]);
  }
  
  const changeValue = (value, id, index) => {
    if (id === 'id') items[index].Name.value = value;
    if (id === 'name') items[index].tag.value.display.value.Name = value ? nbt.string(value) : undefined;
    if (id === 'unbreakable') items[index].tag.value.Unbreakable = value ? nbt.byte(value) : undefined;
    setItems([...items]);
  }
  
  const changeLore = (lores, i) => {
    items[i].tag.value.display.value.Lore = lores.length ? nbt.list(nbt.string(lores)) : undefined;
    setItems([...items]);
  }
  
  const changeEnchant = (enchants, i) => {
    items[i].tag.value.ench = enchants.length ? nbt.list(nbt.comp(enchants)) : undefined;
    setItems([...items]);
  }
  
  React.useEffect(() => {
    setItems(items.map((item, i) => {
      item.Slot.value = i;
      return item;
    }));
  }, [ items.length ])
  
  const createPanel = () => {
    return items.map((item, i) => {
      const itemId = item.Name.value;
      const itemName = item.tag.value.display.value.Name?.value ?? '';
      const itemLore = item.tag.value.display.value.Lore?.value?.value ?? [];
      const itemEnchant = item.tag.value.ench?.value?.value ?? [];
      const isUnbreakable = item.tag.value.Unbreakable?.value;
      
      return (
        <Accordion key={i} sx={styles.item} expanded={expand === i} onChange={() => handleExpand(i)}>
          <AccordionSummary>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
              <Chip 
                label={`#${i + 1}`} 
                size="small" 
                color="primary" 
                sx={{ mr: 2, fontWeight: 600 }}
              />
              <Typography style={styles.itemTitle}>{itemId || 'Empty Item'}</Typography>
              <div style={styles.right}/>
              <IconButton size="small" onClick={(e) => deleteItem(e, i)} color="error">
                <CloseIcon/>
              </IconButton>
            </Box>
          </AccordionSummary>
          
          <Box sx={{ p: 3, bgcolor: '#fafafa' }}>
            
            <PreviewLabel value="Item Identifier"/>
            <TextField 
              value={itemId} 
              placeholder="minecraft:diamond_sword"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => changeValue(e.target.value, 'id', i)}
            />
            
            <PreviewLabel value="Custom Display Name"/>
            <TextField 
              value={itemName} 
              placeholder="Legendary Sword"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => changeValue(e.target.value, 'name', i)}
            />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PreviewLabel value="Lore (Description)"/>
                <IconButton size="small" onClick={() => {
                  itemLore.push('');
                  changeLore(itemLore, i);
                }} color="primary">
                  <AddIcon/>
                </IconButton>
              </Box>
              
              {...itemLore.map((lore, loreIndex) => (
                <Box key={loreIndex} sx={{ display: 'flex', mb: 1 }}>
                  <TextField 
                    multiline 
                    fullWidth
                    placeholder="Enter lore text..."
                    value={lore} 
                    onChange={(e) => {
                      itemLore[loreIndex] = e.target.value;
                      changeLore(itemLore, i);
                    }}
                  />
                  <IconButton onClick={() => {
                    itemLore.splice(loreIndex, 1);
                    changeLore(itemLore, i);
                  }} color="error">
                    <CloseIcon/>
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PreviewLabel value="Enchantments"/>
                <IconButton size="small" onClick={() => {
                  itemEnchant.push(createEnchant());
                  changeEnchant(itemEnchant, i);
                }} color="primary">
                  <AddIcon/>
                </IconButton>
              </Box>
              
              {...itemEnchant.map((enchant, enchIndex) => (
                <Paper key={enchIndex} sx={{ p: 2, mb: 1, bgcolor: 'white' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    ID: {enchant.id.value ?? '-'} | Level: {enchant.lvl.value ?? '-'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Select 
                      value={enchant.id.value} 
                      size="small" 
                      sx={{ flex: 1 }}
                      MenuProps={{ style: { maxHeight: '400px' }}} 
                      onChange={(e) => {
                        enchant.id.value = Number(e.target.value);
                        changeEnchant(itemEnchant, i);
                      }}
                    >
                      {...Object.keys(EnchantmentTypes).map(enchId => (
                        <MenuItem key={enchId} value={enchId}>
                          {EnchantmentTypes[enchId]}
                        </MenuItem>
                      ))}
                    </Select>
                    <NumberField 
                      value={enchant.lvl.value} 
                      placeholder="Level"
                      sx={{ width: '100px' }} 
                      onChange={(value) => {
                        enchant.lvl.value = value;
                        changeEnchant(itemEnchant, i);
                      }}
                    />
                    <IconButton onClick={() => {
                      itemEnchant.splice(enchIndex, 1);
                      changeEnchant(itemEnchant, i);
                    }} color="error">
                      <CloseIcon/>
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                Unbreakable
              </Typography>
              <Switch 
                checked={!!isUnbreakable}
                onChange={(e) => changeValue(e.target.checked ? 1 : 0, 'unbreakable', i)}
                color="primary"
              />
            </Box>
            
          </Box>
        </Accordion>
      )
    })
  }
  
  return (
    <>
    <Head>
      <title>Item Generator - Minecraft Tools</title>
      <meta name="description" content="Create custom Minecraft items with enchantments and export as mcstructure files" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
    <Header name="Item Generator" pageId="items" />
    
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Chip 
          label="Minecraft Bedrock Edition" 
          color="primary" 
          sx={{ mb: 2, fontSize: '0.9rem', fontWeight: 600 }}
        />
        <Typography variant="body1" color="text.secondary">
          Create custom items with enchantments and export as chest structures
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon sx={{ color: '#4CAF50' }} />
              <Typography variant="h6" fontWeight={600}>
                Items ({items.length}/{MAX_COUNT})
              </Typography>
            </Box>
            <Button 
              startIcon={<AddIcon/>} 
              variant="contained" 
              onClick={addItem}
              size="large"
            >
              Add Item
            </Button>
          </Box>
          
          <List sx={{ p: 0 }}>
            {...createPanel()}
          </List>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            💾 Export Options
          </Typography>
          
          <TextField 
            id="fileName" 
            label="File Name"
            defaultValue="export"
            fullWidth
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon/>}
              size="large"
              onClick={() => {
                updateList();
                exportStructure(JSON.parse(JSON.stringify(template)));
                showSnackbar('Structure file generated!', 'success');
              }}
            >
              Export as Structure
            </Button>

            <Button 
              variant="outlined" 
              startIcon={<DataObjectIcon/>}
              size="large"
              onClick={() => {
                updateList();
                exportJson(template);
                showSnackbar('JSON file generated!', 'success');
              }}
            >
              Export as JSON
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            🐛 Debug View
          </Typography>
          <Box sx={{ maxHeight: '400px', overflow: 'auto', fontSize: '0.85rem' }}>
            {generateTree(items)}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Made for Minecraft content creators |{' '}
          <a href="https://github.com/tutinoko2048/mcstructure-converter" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </Typography>
      </Box>
    </Box>
    </>
  )
}

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

function exportJson(data) {
  const fileName = document.getElementById('fileName');
  const blob = new Blob([ JSON.stringify(data, null, 2) ]);
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = `${fileName.value}.json`;
  a.click();
}

function generateTree(obj) {
  return (
    <ul style={{ paddingLeft: '1.5em', listStyle: 'none' }}>
      {...Object.keys(obj).map(k => {
        if (isObject(obj[k])) return <li key={k} style={{ marginBottom: '0.5em' }}><strong>{k}:</strong> {generateTree(obj[k])}</li>
        return <li
          key={k}
          style={obj[k] === undefined ? { color: '#999' } : { color: '#333' }}>
            <strong>{k}:</strong> {typeView(obj[k])}
          </li>
      })}
    </ul>
  )
}

function typeView(value) {
  return typeof value === 'string' ? `"${value}"` : String(value);
}

function isObject(item) {
  return item && typeof item === 'object';
}

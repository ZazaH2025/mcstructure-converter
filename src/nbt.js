/**
 * NBT (Named Binary Tag) Processing Utilities
 * 
 * This file handles conversion between Minecraft structure files (.mcstructure)
 * and JSON format. It uses the prismarine-nbt library for parsing/writing NBT data
 * and nbt-ts for SNBT (String NBT) support.
 * 
 * NBT is Minecraft's binary data format for storing structured game data like
 * world structures, entities, and items.
 */

import * as nbt from 'prismarine-nbt';
import * as snbt from 'nbt-ts';

// Re-export enchantment types for convenience
export * from './EnchantmentTypes';

/**
 * Converts NBT data object to binary format suitable for .mcstructure files
 * 
 * @param {Object} data - Parsed NBT data object
 * @param {string} mode - Conversion mode (currently unused, kept for compatibility)
 * @param {boolean} isLevelDat - Whether this is a level.dat file (requires special header)
 * @returns {Buffer} Binary NBT data ready to be written to file
 */
export function parseStructure(data, mode, isLevelDat) {
  // Convert NBT data to uncompressed binary format using little-endian byte order
  // Bedrock Edition uses little-endian, while Java Edition uses big-endian
  let rawData = nbt.writeUncompressed(data, 'little');
  
  // level.dat files require an 8-byte header with file type and size information
  if (isLevelDat) {
    rawData = fixLevelDat(rawData);
  }
  
  return rawData;
}

/**
 * Converts NBT data to a downloadable Blob URL
 * 
 * @param {Object} data - NBT data object to convert
 * @param {string} mode - Conversion mode (currently unused)
 * @param {boolean} isLevelDat - Whether to add level.dat header
 * @returns {string} Blob URL that can be used for file download
 */
export function writeStructure(data, mode, isLevelDat) {
  // Convert data to binary structure
  const structure = parseStructure(data, mode, isLevelDat);
  
  // Create a downloadable blob from the binary data
  const blob = new Blob([ structure ]);
  const url = window.URL.createObjectURL(blob);
  
  return url;
}

/** 
 * Adds the required 8-byte header to level.dat files
 * 
 * Bedrock Edition level.dat files require a special header:
 * - First 4 bytes: File type identifier (10 = NBT compound)
 * - Next 4 bytes: Size of the NBT data in bytes
 * 
 * @param {Buffer} dat - The NBT data buffer
 * @returns {Buffer} Buffer with header prepended
 */
function fixLevelDat(dat) {
  // Create file type header (4 bytes, little-endian integer = 10)
  const fileType = 10;
  const fileTypeData = Buffer.alloc(4, 0);
  fileTypeData.writeInt32LE(fileType);

  // Create size header (4 bytes, little-endian integer = data length)
  const sizeData = Buffer.alloc(4, 0);
  sizeData.writeInt32LE(dat.byteLength);

  // Combine: [file type (4 bytes)] + [size (4 bytes)] + [NBT data]
  return Buffer.concat([fileTypeData, sizeData, dat]);
}

/**
 * Creates a new Minecraft item NBT structure with default values
 * 
 * This generates the complete NBT structure needed for a Minecraft item,
 * including slots for custom names, lore, enchantments, and other attributes.
 * 
 * @param {string} typeId - The Minecraft item identifier (e.g., 'minecraft:diamond_sword')
 * @returns {Object} NBT compound structure for the item
 */
export function createItem(typeId = '') {
  return {
    Count: { type: "byte", value: 1 },           // Stack size (1-64 for most items)
    Damage: { type: "short", value: 0 },         // Item durability damage
    Name: { type: "string", value: typeId },     // Item identifier
    Slot: { type: "byte", value: 0 },            // Inventory slot position
    WasPickedUp: { type: "byte", value: 0 },     // Whether item was picked up by player
    tag: {
      type: "compound",
      value: {
        display: {
          // Display properties like custom name and lore
          type: "compound",
          value: {
            // Custom properties are added dynamically:
            // Lore: { type: "list", value: { type: "string", value: [] } }
            // Name: { type: "string", value: "" }
          }
        },
        // Additional tags added dynamically:
        // ench: { type: "list", value: { type: "compound", value: [] } }  // Enchantments
        // Unbreakable: { type: "byte", value: 0 }  // Unbreakable flag
      }
    }
  }
}

/**
 * Creates an enchantment NBT structure
 * 
 * Enchantments are stored as compound tags with an ID and level.
 * See EnchantmentTypes.js for the mapping of IDs to enchantment names.
 * 
 * @param {number} id - Enchantment ID (0-37, see EnchantmentTypes)
 * @param {number} level - Enchantment level (typically 1-5, but can be higher)
 * @returns {Object} NBT compound representing the enchantment
 */
export function createEnchant(id, level = 1) {
  return {
    id: { type: "short", value: id },      // Enchantment type ID
    lvl: { type: "short", value: level }   // Enchantment strength level
  }
}

/**
 * Minecraft Bedrock Edition Enchantment Types
 * 
 * This file maps Minecraft enchantment IDs to their readable names.
 * Used when generating items with enchantments in the Item Generator tool.
 * 
 * Each enchantment has a unique numeric ID that corresponds to its effect.
 * These IDs are specific to Minecraft Bedrock Edition.
 * 
 * Source: https://minecraft.fandom.com/wiki/Bedrock_Edition_data_values#Enchantment_IDs
 */

export const EnchantmentTypes = {
  // Armor Enchantments
  0: "protection",              // Reduces most types of damage
  1: "fire_protection",         // Reduces fire and lava damage
  2: "feather_falling",         // Reduces fall damage
  3: "blast_protection",        // Reduces explosion damage
  4: "projectile_protection",   // Reduces projectile damage
  5: "thorns",                  // Damages attackers
  6: "respiration",             // Extends underwater breathing time
  7: "depth_strider",           // Increases underwater movement speed
  8: "aqua_affinity",           // Increases underwater mining speed
  
  // Weapon Enchantments
  9: "sharpness",               // Increases melee damage
  10: "smite",                  // Extra damage to undead mobs
  11: "bane_of_arthropods",     // Extra damage to spiders, bees, silverfish
  12: "knockback",              // Increases knockback on hit
  13: "fire_aspect",            // Sets targets on fire
  14: "looting",                // Increases mob loot drops
  
  // Tool Enchantments
  15: "efficiency",             // Increases mining speed
  16: "silk_touch",             // Blocks drop themselves instead of items
  17: "unbreaking",             // Increases item durability
  18: "fortune",                // Increases block drops (ores, crops, etc.)
  
  // Bow Enchantments
  19: "power",                  // Increases arrow damage
  20: "punch",                  // Increases arrow knockback
  21: "flame",                  // Sets arrows on fire
  22: "infinity",               // Shooting consumes no arrows
  
  // Fishing Rod Enchantments
  23: "luck_of_the_sea",        // Increases fishing luck
  24: "lure",                   // Decreases fishing wait time
  
  // Special Enchantments
  25: "frost_walker",           // Creates ice blocks under feet on water
  26: "mending",                // Repairs item with XP orbs
  27: "binding_curse",          // Item cannot be removed from armor slot
  28: "vanishing_curse",        // Item disappears on death
  
  // Trident Enchantments
  29: "impaling",               // Extra damage to aquatic mobs
  30: "riptide",                // Launches player when thrown in water
  31: "loyalty",                // Trident returns after being thrown
  32: "channeling",             // Summons lightning on hit during storms
  
  // Crossbow Enchantments
  33: "multishot",              // Shoots 3 arrows at once
  34: "piercing",               // Arrows pass through entities
  35: "quick_charge",           // Decreases crossbow reload time
  
  // Boot Enchantments
  36: "soul_speed",             // Increases movement speed on soul blocks
  37: "swift_sneak",            // Increases sneaking speed
}

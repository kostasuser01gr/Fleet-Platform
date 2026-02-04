import { EnhancedVehiclePart, PartUpgrade, PartGem, Enchantment } from '../types/advancedInventory';
import { VehiclePart } from '../types/inventory';

export class PartUpgradeService {
  private static upgradeTree: Map<string, PartUpgrade[]> = new Map();

  static initialize(): void {
    // Initialize upgrade trees for each part type
    this.setupUpgradeTrees();
  }

  private static setupUpgradeTrees(): void {
    const partTypes = ['engine', 'tires', 'transmission', 'suspension', 'brakes', 'electronics'];
    
    partTypes.forEach(type => {
      const upgrades: PartUpgrade[] = [];
      
      for (let tier = 1; tier <= 5; tier++) {
        upgrades.push({
          id: `${type}_upgrade_tier_${tier}`,
          tier,
          requirements: {
            parts: [`upgrade_material_${tier}`],
            currency: tier * 1000,
            workshopLevel: tier,
            reputation: tier * 100,
          },
          bonuses: {
            performance: tier * 5,
            durability: tier * 3,
          },
          unlocked: false,
        });
      }
      
      this.upgradeTree.set(type, upgrades);
    });
  }

  static getAvailableUpgrades(part: VehiclePart, playerLevel: number): PartUpgrade[] {
    const enhancedPart = part as EnhancedVehiclePart;
    const currentTier = enhancedPart.currentUpgradeTier || 0;
    const upgrades = this.upgradeTree.get(part.type) || [];
    
    return upgrades.filter(upgrade => {
      // Check if tier is next available
      if (upgrade.tier !== currentTier + 1) return false;
      
      // Check workshop level requirement
      if (upgrade.requirements.workshopLevel && playerLevel < upgrade.requirements.workshopLevel) return false;
      
      return true;
    });
  }

  static upgradePart(part: VehiclePart, upgrade: PartUpgrade): EnhancedVehiclePart {
    const enhancedPart: EnhancedVehiclePart = {
      ...part,
      currentUpgradeTier: upgrade.tier,
      socketSlots: upgrade.tier,
      gems: [],
      enchantments: [],
      forgeLevel: 0,
      modifications: [],
      upgradeTree: this.upgradeTree.get(part.type),
    };
    
    // Apply bonuses
    if (upgrade.bonuses.performance) {
      enhancedPart.performance += upgrade.bonuses.performance;
    }
    if (upgrade.bonuses.durability) {
      enhancedPart.durability += upgrade.bonuses.durability;
    }
    
    return enhancedPart;
  }

  static socketGem(part: EnhancedVehiclePart, gem: PartGem): EnhancedVehiclePart {
    if (part.gems.length >= part.socketSlots) {
      throw new Error('No available socket slots');
    }
    
    return {
      ...part,
      gems: [...part.gems, gem],
    };
  }

  static removeGem(part: EnhancedVehiclePart, gemId: string): EnhancedVehiclePart {
    return {
      ...part,
      gems: part.gems.filter(g => g.id !== gemId),
    };
  }

  static applyEnchantment(part: EnhancedVehiclePart, enchantment: Enchantment): EnhancedVehiclePart {
    const maxEnchantments = 3;
    if (part.enchantments.length >= maxEnchantments) {
      throw new Error('Maximum enchantments reached');
    }
    
    return {
      ...part,
      enchantments: [...part.enchantments, enchantment],
    };
  }

  static forgePart(part: EnhancedVehiclePart): EnhancedVehiclePart {
    const maxForgeLevel = 10;
    if (part.forgeLevel >= maxForgeLevel) {
      throw new Error('Maximum forge level reached');
    }
    
    const newForgeLevel = part.forgeLevel + 1;
    const forgeBonus = newForgeLevel * 2;
    
    return {
      ...part,
      forgeLevel: newForgeLevel,
      performance: part.performance + forgeBonus,
      durability: part.durability + forgeBonus,
    };
  }

  static calculateTotalStats(part: EnhancedVehiclePart): {
    performance: number;
    durability: number;
    efficiency: number;
  } {
    let performance = part.performance;
    let durability = part.durability;
    let efficiency = 0;
    
    // Add gem bonuses
    part.gems.forEach(gem => {
      performance += gem.bonus;
    });
    
    // Add enchantment bonuses
    part.enchantments.forEach(enchant => {
      Object.entries(enchant.bonus).forEach(([key, value]) => {
        if (key === 'performance') performance += value;
        if (key === 'durability') durability += value;
        if (key === 'efficiency') efficiency += value;
      });
    });
    
    // Add forge bonuses (already applied to base stats)
    
    return { performance, durability, efficiency };
  }

  static getUpgradeCost(part: VehiclePart, targetTier: number): number {
    const enhancedPart = part as EnhancedVehiclePart;
    const currentTier = enhancedPart.currentUpgradeTier || 0;
    const upgrades = this.upgradeTree.get(part.type) || [];
    
    let totalCost = 0;
    for (let tier = currentTier + 1; tier <= targetTier; tier++) {
      const upgrade = upgrades.find(u => u.tier === tier);
      if (upgrade) {
        totalCost += upgrade.requirements.currency;
      }
    }
    
    return totalCost;
  }
}

// Initialize on import
PartUpgradeService.initialize();

export default PartUpgradeService;

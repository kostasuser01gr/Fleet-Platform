import { VehiclePart, ServiceCooperator } from '../types/inventory';
import { Vehicle } from '../types/vehicle';
import { ValidationResult, InstallationValidation } from '../types/advancedInventory';

export class ValidationService {
  static validatePart(part: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!part?.id || typeof part.id !== 'string') {
      errors.push('Invalid part ID');
    }

    if (!part?.name || typeof part.name !== 'string') {
      errors.push('Invalid part name');
    }

    if (typeof part?.condition !== 'number' || part.condition < 0 || part.condition > 100) {
      errors.push('Condition must be between 0 and 100');
    }

    if (typeof part?.price !== 'number' || part.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (part?.condition < 30) {
      warnings.push('Part condition is critically low');
    }

    if (part?.durability < 20) {
      warnings.push('Part durability is low - consider replacement');
    }

    return {
      valid: errors.length === 0,
      error: errors.join(', '),
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  static validatePartInstallation(
    vehicle: Vehicle,
    part: VehiclePart
  ): InstallationValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const compatibilityIssues: string[] = [];

    // Check if part requirements are met
    if (part.requirements?.level && vehicle.status !== 'available') {
      errors.push('Vehicle must be available for installation');
    }

    if (part.requirements?.reputation) {
      // Would check player reputation here
      warnings.push('This part requires high reputation');
    }

    // Check vehicle compatibility
    const vehicleType = vehicle.type;
    // Removed invalid type comparison - vehicle types don't include 'electric'

    // Check condition
    if (part.condition < 50) {
      warnings.push('Installing a part with low condition may affect performance');
    }

    // Check for existing parts
    const existingPartOfType = this.hasPartOfType(vehicle, part.type);
    if (existingPartOfType) {
      warnings.push(`Existing ${part.type} will be replaced`);
    }

    return {
      valid: errors.length === 0 && compatibilityIssues.length === 0,
      error: errors.join(', '),
      warnings: warnings.length > 0 ? warnings : undefined,
      compatibilityIssues: compatibilityIssues.length > 0 ? compatibilityIssues : undefined
    };
  }

  static validateCooperator(cooperator: any): ValidationResult {
    const errors: string[] = [];

    if (!cooperator?.id || typeof cooperator.id !== 'string') {
      errors.push('Invalid cooperator ID');
    }

    if (!cooperator?.name || typeof cooperator.name !== 'string') {
      errors.push('Invalid cooperator name');
    }

    if (typeof cooperator?.priceMultiplier !== 'number' || cooperator.priceMultiplier <= 0) {
      errors.push('Price multiplier must be greater than 0');
    }

    if (typeof cooperator?.quality !== 'number' || cooperator.quality < 1 || cooperator.quality > 5) {
      errors.push('Quality must be between 1 and 5');
    }

    return {
      valid: errors.length === 0,
      error: errors.join(', ')
    };
  }

  static validateServiceRequest(
    cooperator: ServiceCooperator,
    playerBudget: number,
    serviceType: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!cooperator.unlocked) {
      errors.push('Cooperator must be unlocked first');
    }

    if (!cooperator.services.includes(serviceType as any)) {
      errors.push('Cooperator does not offer this service');
    }

    const estimatedCost = 100 * cooperator.priceMultiplier;
    if (playerBudget < estimatedCost) {
      errors.push('Insufficient funds for this service');
    } else if (playerBudget < estimatedCost * 1.5) {
      warnings.push('Service will use most of your budget');
    }

    return {
      valid: errors.length === 0,
      error: errors.join(', '),
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  private static hasPartOfType(vehicle: Vehicle, partType: string): boolean {
    // Implementation would check vehicle's installed parts
    return false;
  }

  static sanitizeInput(input: string): string {
    return input.replace(/[<>\"']/g, '').trim();
  }

  static validatePrice(price: number): boolean {
    return typeof price === 'number' && price >= 0 && price < 10000000;
  }

  static validateQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= 1000;
  }
}

export default ValidationService;

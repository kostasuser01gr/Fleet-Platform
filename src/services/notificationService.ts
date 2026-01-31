// Notification Service - Email/WhatsApp Template Generation

import type { PartsRequest, Quote, CustomPartner } from '../types/partsRadar';
import type { Vehicle } from '../types/vehicle';

interface MessageTemplate {
  subject?: string;
  body: string;
  whatsapp?: string;
}

class NotificationService {
  /**
   * Generate email/WhatsApp message for parts request
   */
  static generateRequestMessage(
    request: PartsRequest,
    vehicles: Array<Vehicle>,
    partner?: CustomPartner
  ): MessageTemplate {
    const vehicleDetails = vehicles
      .filter((v) => request.vehicleIds.includes(v.id))
      .map((v) => `${v.year} ${v.make} ${v.model} (${v.vin})`)
      .join(', ');

    const partsList = request.partLines
      .map((p) => `- ${p.description} (Qty: ${p.qty}, Urgency: ${p.urgency})`)
      .join('\n');

    const subject = `Parts Request - ${request.requestId.slice(0, 8)}`;
    
    const body = `Dear ${partner?.name || 'Partner'},

We are requesting the following parts for our fleet:

Request ID: ${request.requestId}
Mode: ${request.mode}
Vehicles: ${vehicleDetails}

Parts Required:
${partsList}

Constraints:
- Radius: ${request.constraints.radiusKm} km
- Must be in stock: ${request.constraints.mustBeInStock ? 'Yes' : 'No'}
- Delivery required: ${request.constraints.deliveryRequired ? 'Yes' : 'No'}
${request.constraints.maxTotalCost ? `- Max total cost: $${request.constraints.maxTotalCost}` : ''}

Please provide a quote at your earliest convenience.

Thank you,
Fleet Management Team`;

    const whatsapp = `*Parts Request - ${request.requestId.slice(0, 8)}*

Request ID: ${request.requestId}
Mode: ${request.mode}
Vehicles: ${vehicleDetails}

*Parts Required:*
${partsList}

*Constraints:*
• Radius: ${request.constraints.radiusKm} km
• Must be in stock: ${request.constraints.mustBeInStock ? 'Yes' : 'No'}
• Delivery required: ${request.constraints.deliveryRequired ? 'Yes' : 'No'}
${request.constraints.maxTotalCost ? `• Max total cost: $${request.constraints.maxTotalCost}` : ''}

Please provide a quote. Thank you!`;

    return { subject, body, whatsapp };
  }

  /**
   * Generate quote acceptance message
   */
  static generateQuoteAcceptanceMessage(
    quote: Quote,
    request: PartsRequest,
    partner: CustomPartner
  ): MessageTemplate {
    const subject = `Quote Accepted - ${quote.quoteId.slice(0, 8)}`;
    
    const body = `Dear ${partner.name},

We are pleased to inform you that we have accepted your quote for Request ${request.requestId.slice(0, 8)}.

Quote Details:
- Quote ID: ${quote.quoteId}
- Total Amount: $${quote.totals.grandTotal.toFixed(2)}
- ETA: ${quote.etaMinutes ? `${quote.etaMinutes} minutes` : 'TBD'}

Please proceed with the order and confirm delivery details.

Thank you,
Fleet Management Team`;

    const whatsapp = `*Quote Accepted - ${quote.quoteId.slice(0, 8)}*

We have accepted your quote for Request ${request.requestId.slice(0, 8)}.

*Quote Details:*
• Quote ID: ${quote.quoteId}
• Total: $${quote.totals.grandTotal.toFixed(2)}
• ETA: ${quote.etaMinutes ? `${quote.etaMinutes} minutes` : 'TBD'}

Please proceed with the order. Thank you!`;

    return { subject, body, whatsapp };
  }

  /**
   * Copy message to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Generate WhatsApp link
   */
  static generateWhatsAppLink(phone: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  }

  /**
   * Generate email link
   */
  static generateEmailLink(email: string, subject: string, body: string): string {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  }
}

export { NotificationService };

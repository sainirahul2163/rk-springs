import { linkTo } from '@/data/routes';
import { primaryEmail, primaryPhone, site, whatsappPhone } from '@/data/site';

export function telHref(e164: string = primaryPhone.e164): string {
  return `tel:${e164}`;
}

export function mailHref(email: string = primaryEmail, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/** WhatsApp click-to-chat link with an optional pre-filled message giving page context. */
export function whatsappHref(context?: string): string {
  const number = whatsappPhone.e164.replace(/\D/g, '');
  const text = context
    ? `Hi ${site.shortBrand}, I have an enquiry about ${context}.`
    : `Hi ${site.shortBrand}, I have a spring enquiry.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** RFQ page (with optional query), or a WhatsApp quote request while the RFQ page isn't published. */
export function quoteHref(query = '', context = 'a quote'): string {
  const rfq = linkTo('rfq');
  return rfq ? `${rfq}${query}` : whatsappHref(context);
}

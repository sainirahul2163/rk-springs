import { useState } from 'react';
import { track } from '@/lib/analytics';
import { fieldErrors, rfqFieldsSchema } from '@/lib/rfq/schema';
import { CheckField, TextAreaField, TextField } from './fields';
import { TurnstileField } from './TurnstileField';

export interface EnquiryFormProps {
  sourcePage: string;
  turnstileSiteKey: string;
  whatsappHref: string;
}

export function EnquiryForm({ sourcePage, turnstileSiteKey, whatsappHref }: EnquiryFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState('');

  async function submit() {
    const parsed = rfqFieldsSchema.safeParse({
      name,
      company,
      phone,
      email,
      city: '',
      spring_type: 'general',
      quantity: '',
      notes,
      sample_coming: false,
      consent,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setPending(true);
    setFormError('');
    try {
      const body = new FormData();
      body.set('name', name);
      body.set('company', company);
      body.set('phone', phone);
      body.set('email', email);
      body.set('spring_type', 'general');
      body.set('notes', notes);
      if (consent) body.set('consent', 'true');
      body.set('source_page', sourcePage);
      body.set('utm', '{}');
      body.set('website', '');
      if (token) body.set('cf-turnstile-response', token);

      const res = await fetch('/api/rfq/', { method: 'POST', body });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok || !data.id) {
        setFormError(
          data.error ??
            'Something went wrong. WhatsApp us the enquiry and we will reply within 24 hours.',
        );
        return;
      }
      track('rfq_submit', { spring_type: 'general' });
      window.location.assign(`/request-a-quote/thank-you/?id=${encodeURIComponent(data.id)}`);
    } catch {
      setFormError(
        'Something went wrong. WhatsApp us the enquiry and we will reply within 24 hours.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <TextField
        label="Your name"
        name="name"
        value={name}
        onChange={setName}
        required
        autoComplete="name"
        error={errors.name}
      />
      <TextField
        label="Company"
        name="company"
        value={company}
        onChange={setCompany}
        autoComplete="organization"
      />
      <TextField
        label="Phone / WhatsApp"
        name="phone"
        value={phone}
        onChange={setPhone}
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors.phone}
      />
      <TextField
        label="Email"
        name="email"
        value={email}
        onChange={setEmail}
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.email}
      />
      <TextAreaField
        label="What do you need?"
        name="notes"
        value={notes}
        onChange={setNotes}
        required
        hint="Spring type, quantity, and whether you have a drawing or a sample."
        error={errors.notes}
      />
      <CheckField name="consent" checked={consent} onChange={setConsent} error={errors.consent}>
        I agree that RK Enterprises may use my details to reply.{' '}
        <a href="/privacy-policy/" className="text-blue-700 underline">
          Privacy policy
        </a>
        .
      </CheckField>
      <TurnstileField siteKey={turnstileSiteKey} token={token} setToken={setToken} />
      {formError ? (
        <p className="field-error" role="alert">
          {formError}{' '}
          <a href={whatsappHref} className="underline" target="_blank" rel="noopener">
            WhatsApp the enquiry
          </a>
          .
        </p>
      ) : null}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}

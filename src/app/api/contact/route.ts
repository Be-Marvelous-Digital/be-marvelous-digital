import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name: string;
    email: string;
    phone: string;
    message: string;
  };

  const { name, email, phone, message } = body;

  if (!email || !name || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const actionUrl = process.env.MAILCHIMP_ACTION_URL;
  if (!actionUrl) {
    console.error('MAILCHIMP_ACTION_URL is not configured');
    return NextResponse.json({ error: 'Contact form is not configured' }, { status: 500 });
  }

  try {
    // Mailchimp embedded-form POST uses URL-encoded fields.
    // Field names match the merge tags configured in your Mailchimp audience:
    //   EMAIL  → required subscriber email
    //   FNAME  → Full Name (rename in Mailchimp: Audience → Settings → Audience fields)
    //   PHONE  → Phone (enable in Mailchimp audience fields)
    //   MMERGE5 or MESSAGE → custom text merge tag for the project description
    const formData = new URLSearchParams();
    formData.append('EMAIL', email);
    formData.append('FNAME', name);
    formData.append('PHONE', phone ?? '');
    formData.append('MESSAGE', message);
    // Mailchimp honeypot — must be empty to pass bot check
    formData.append('b_', '');

    const response = await fetch(actionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      // Mailchimp redirects on success; follow silently
      redirect: 'follow',
    });

    // Mailchimp returns 200 even on validation errors (they redirect),
    // so we treat any reachable response as success on our end.
    if (!response.ok && response.status !== 302 && response.status !== 301) {
      throw new Error(`Mailchimp responded with ${response.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Mailchimp submission error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}

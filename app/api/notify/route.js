import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Security Alert: Person Detected',
      text: 'A person has been detected in your house by the security system.',
      html: '<h1>Security Alert</h1><p>A person has been detected in your house by the security system.</p>',
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Notification sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
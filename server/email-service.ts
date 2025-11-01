// Email service using Resend for secure email delivery
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not found - email verification will be disabled");
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !resend) {
    console.warn("Email sending disabled - RESEND_API_KEY not configured");
    return false;
  }

  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) {
      emailData.text = params.text;
    }
    
    if (params.html) {
      emailData.html = params.html;
    }
    
    await resend.emails.send(emailData);
    return true;
  } catch (error: any) {
    console.error('Resend email error:', error.message);
    if (error.response) {
      console.error('Resend response:', JSON.stringify(error.response, null, 2));
    }
    return false;
  }
}

export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendContactFormNotification(
  contactData: {
    name: string;
    email: string;
    company?: string;
    message: string;
  },
  attachments?: Array<{fileName: string; originalName: string; size: number}>
): Promise<boolean> {
  const senderEmail = "noreply@your-domain.com"; // Use your verified Resend domain
  const destinationEmail = "tiago.vilasboas@outlook.com";
  
  const attachmentsList = attachments && attachments.length > 0 
    ? attachments.map(att => `• ${att.originalName} (${Math.round(att.size / 1024)}KB)`).join('\n')
    : 'None';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #333; }
        .value { margin-left: 10px; color: #666; }
        .message { background: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 5px; }
        .attachments { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Contact Form Submission</h2>
        
        <div class="field">
          <span class="label">Name:</span>
          <span class="value">${contactData.name}</span>
        </div>
        
        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${contactData.email}</span>
        </div>
        
        ${contactData.company ? `<div class="field">
          <span class="label">Company:</span>
          <span class="value">${contactData.company}</span>
        </div>` : ''}
        
        <div class="message">
          <strong>Message:</strong><br><br>
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        
        ${attachments && attachments.length > 0 ? `<div class="attachments">
          <strong>Attachments (${attachments.length}):</strong><br>
          ${attachmentsList.replace(/\n/g, '<br>')}
        </div>` : ''}
        
        <p><small>Submitted via your consulting website contact form</small></p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.company ? `Company: ${contactData.company}\n` : ''}Message:\n${contactData.message}

${attachments && attachments.length > 0 ? `Attachments (${attachments.length}):\n${attachmentsList}` : 'Attachments: None'}

Submitted via your consulting website contact form
  `;

  return await sendEmail({
    to: destinationEmail,
    from: senderEmail,
    subject: `💼 New Contact Form Submission from ${contactData.name}`,
    text: textContent,
    html: htmlContent,
  });
}

export async function send2FAVerificationEmail(
  email: string, 
  username: string, 
  code: string
): Promise<boolean> {
  const senderEmail = "noreply@your-domain.com"; // Use your verified Resend domain
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .code { background: #007bff; color: white; padding: 15px 25px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 3px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Admin Console Login Verification</h2>
        <p>Hello <strong>${username}</strong>,</p>
        <p>You requested access to your consulting website admin console. Please use the verification code below to complete your login:</p>
        
        <div class="code">${code}</div>
        
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        
        <div class="warning">
          <strong>Security Notice:</strong> If you didn't request this code, please ignore this email. Never share this code with anyone.
        </div>
        
        <p>Best regards,<br>Your Website Security System</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Admin Console Login Verification

Hello ${username},

You requested access to your consulting website admin console. Please use this verification code to complete your login:

Verification Code: ${code}

This code will expire in 10 minutes.

Security Notice: If you didn't request this code, please ignore this email. Never share this code with anyone.

Best regards,
Your Website Security System
  `;

  return await sendEmail({
    to: email,
    from: senderEmail,
    subject: "🔐 Admin Console Login Verification Code",
    text: textContent,
    html: htmlContent,
  });
}
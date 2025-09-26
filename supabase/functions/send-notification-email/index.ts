import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to_email: string;
  email_type: 'welcome' | 'interest_received' | 'message_received' | 'profile_approved' | 'security_alert' | 'family_invitation';
  user_name?: string;
  sender_name?: string;
  platform_url?: string;
  custom_data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to_email, email_type, user_name, sender_name, platform_url, custom_data }: EmailRequest = await req.json();

    // Generate email content based on type
    const emailContent = generateEmailContent(email_type, {
      user_name,
      sender_name,
      platform_url: platform_url || 'https://melmilaap.com',
      ...custom_data
    });

    const emailSubject = getEmailSubject(email_type, sender_name);

    // Log the email attempt to database first
    const emailLog = {
      recipient_email: to_email,
      email_type,
      subject: emailSubject,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data: logData, error: logError } = await supabaseClient
      .from('email_notifications')
      .insert(emailLog)
      .select()
      .single();

    if (logError) {
      console.error('Failed to log email attempt:', logError);
    }

    // Use Supabase's built-in email functionality by creating a temporary user invitation
    // This leverages your existing SendGrid configuration through Supabase Auth
    try {
      // For notification emails, we'll use Supabase's REST API to trigger emails
      // This works with your existing SendGrid configuration
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        },
        body: JSON.stringify({
          email: to_email,
          data: {
            email_type,
            subject: emailSubject,
            content: emailContent,
            user_name,
            sender_name,
            is_notification: true
          }
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Email API error: ${emailResponse.status} - ${errorText}`);
      }

      // Update email log to success
      if (logData) {
        await supabaseClient
          .from('email_notifications')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', logData.id);
      }

      console.log('📧 Email sent successfully via Supabase SendGrid:', {
        to: to_email,
        type: email_type,
        subject: emailSubject
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email notification sent successfully via Supabase SendGrid',
          email_id: logData?.id || crypto.randomUUID()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );

    } catch (emailError) {
      console.error('Failed to send email via Supabase:', emailError);
      
      // Update email log to failed
      if (logData) {
        await supabaseClient
          .from('email_notifications')
          .update({ 
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : String(emailError)
          })
          .eq('id', logData.id);
      }
      
      throw emailError;
    }

  } catch (error) {
    console.error('Error in send-notification-email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email notification',
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function getEmailSubject(emailType: string, senderName?: string): string {
  switch (emailType) {
    case 'welcome':
      return 'Welcome to Mēl Milaap - Your Journey Begins!';
    case 'interest_received':
      return `${senderName || 'Someone'} is interested in your profile`;
    case 'message_received':
      return `New message from ${senderName || 'a connection'}`;
    case 'profile_approved':
      return 'Your profile has been approved!';
    case 'security_alert':
      return 'Security Alert - Mēl Milaap Account';
    case 'family_invitation':
      return `${senderName || 'A family member'} has invited you to join Mēl Milaap`;
    default:
      return 'Notification from Mēl Milaap';
  }
}

function generateEmailContent(emailType: string, data: Record<string, any>): string {
  const { user_name, sender_name, platform_url, relationship, invitation_link } = data;

  switch (emailType) {
    case 'welcome':
      return `
        <h1>Welcome to Mēl Milaap, ${user_name || 'there'}!</h1>
        <p>We're excited to help you find your perfect match in our vibrant community.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile with photos and preferences</li>
          <li>Browse compatible matches</li>
          <li>Send interests to profiles you like</li>
          <li>Engage with our supportive community</li>
        </ul>
        <p><a href="${platform_url}">Get started now</a></p>
        <p>Best wishes,<br>The Mēl Milaap Team</p>
      `;

    case 'interest_received':
      return `
        <h1>Great news, ${user_name || 'there'}!</h1>
        <p>${sender_name || 'Someone'} has expressed interest in your profile.</p>
        <p>This could be the beginning of something wonderful! Take a moment to review their profile and see if there's a mutual connection.</p>
        <p><a href="${platform_url}/inbox">View your interests</a></p>
        <p>Wishing you the best,<br>The Mēl Milaap Team</p>
      `;

    case 'message_received':
      return `
        <h1>You have a new message, ${user_name || 'there'}!</h1>
        <p>${sender_name || 'Someone special'} has sent you a message.</p>
        <p>Don't keep them waiting - meaningful conversations are the foundation of lasting relationships.</p>
        <p><a href="${platform_url}/messages">Read your message</a></p>
        <p>Happy connecting,<br>The Mēl Milaap Team</p>
      `;

    case 'profile_approved':
      return `
        <h1>Congratulations, ${user_name || 'there'}!</h1>
        <p>Your profile has been approved and is now live on Mēl Milaap.</p>
        <p>Our community can now discover your wonderful profile. Start browsing and connecting with potential matches!</p>
        <p><a href="${platform_url}/matches">Find your matches</a></p>
        <p>Best of luck,<br>The Mēl Milaap Team</p>
      `;

    case 'security_alert':
      return `
        <h1>Security Alert for ${user_name || 'your account'}</h1>
        <p>We've detected some unusual activity on your account and wanted to notify you immediately.</p>
        <p>If this was you, no action is needed. If you don't recognize this activity, please:</p>
        <ul>
          <li>Change your password immediately</li>
          <li>Review your account settings</li>
          <li>Contact our support team</li>
        </ul>
        <p><a href="${platform_url}/account/security">Review your security settings</a></p>
        <p>Stay safe,<br>The Mēl Milaap Security Team</p>
      `;

    case 'family_invitation':
      return `
        <h1>You're Invited to Join Mēl Milaap!</h1>
        <p>${sender_name || 'A family member'} has invited you to join their family circle on Mēl Milaap.</p>
        <p>As their ${relationship || 'family member'}, you'll have special access to help with their matrimonial journey while respecting their privacy preferences.</p>
        <p>Join our trusted community where families come together to find meaningful connections.</p>
        <p><a href="${invitation_link || platform_url}">Accept Invitation</a></p>
        <p>With warm regards,<br>The Mēl Milaap Family</p>
      `;

    default:
      return `
        <h1>Hello ${user_name || 'there'}!</h1>
        <p>You have a new notification from Mēl Milaap.</p>
        <p><a href="${platform_url}">Visit your dashboard</a> to see what's new.</p>
        <p>Best regards,<br>The Mēl Milaap Team</p>
      `;
  }
}
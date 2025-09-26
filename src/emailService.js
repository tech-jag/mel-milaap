// src/emailService.js - Supabase native email service

import { supabase } from '@/integrations/supabase/client';

export async function sendWelcomeEmail(userType, email, userData) {
  try {
    console.log('Sending welcome email via Supabase...', { userType, email });

    // Call our Supabase edge function for custom email notifications
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to_email: email,
        email_type: 'welcome',
        user_name: userData.full_name || userData.contact_person || 'Friend',
        platform_url: window.location.origin,
        custom_data: {
          userType,
          business_name: userData.business_name,
          city: userData.city,
          state: userData.state,
          role: userData.role,
          business_category: userData.business_category
        }
      }
    });

    if (error) {
      console.error('Supabase email error:', error);
      return { success: false, error: error.message };
    }

    console.log('Supabase email success:', data);
    return { success: true, result: data };

  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to send interest notifications
export async function sendInterestNotification(receiverEmail, senderName, receiverName) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to_email: receiverEmail,
        email_type: 'interest_received',
        user_name: receiverName,
        sender_name: senderName,
        platform_url: window.location.origin
      }
    });

    if (error) throw error;
    return { success: true, result: data };
  } catch (error) {
    console.error('Interest notification error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to send message notifications
export async function sendMessageNotification(receiverEmail, senderName, receiverName) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to_email: receiverEmail,
        email_type: 'message_received',
        user_name: receiverName,
        sender_name: senderName,
        platform_url: window.location.origin
      }
    });

    if (error) throw error;
    return { success: true, result: data };
  } catch (error) {
    console.error('Message notification error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to send family invitation emails
export async function sendFamilyInvitation(inviteEmail, inviterName, relationship) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to_email: inviteEmail,
        email_type: 'family_invitation',
        user_name: 'Family Member',
        sender_name: inviterName,
        platform_url: window.location.origin,
        custom_data: {
          relationship,
          invitation_link: `${window.location.origin}/family-access`
        }
      }
    });

    if (error) throw error;
    return { success: true, result: data };
  } catch (error) {
    console.error('Family invitation error:', error);
    return { success: false, error: error.message };
  }
}
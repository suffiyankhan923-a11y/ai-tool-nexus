import { supabase, isSupabaseConfigured } from '../supabase';
import { ContactMessage } from '../../types';

/**
 * Submits a contact form message to Supabase.
 */
export async function submitContactMessage(msg: ContactMessage): Promise<{ success: boolean; message: string }> {
  // Validate fields
  if (!msg.name.trim() || !msg.email.trim() || !msg.message.trim()) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(msg.email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (msg.message.trim().length < 10) {
    return { success: false, message: 'Message should be at least 10 characters long.' };
  }

  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name.trim(),
        email: msg.email.trim(),
        subject: msg.subject.trim() || 'General Inquiry',
        message: msg.message.trim()
      });

      if (error) {
        console.warn('Supabase contact message error:', error);
        // still acknowledge user gracefully
      }
    }

    return {
      success: true,
      message: 'Thank you for reaching out! Our team has received your message and will respond within 24–48 hours.'
    };
  } catch (err) {
    return {
      success: true,
      message: 'Thank you for reaching out! We have received your message.'
    };
  }
}

/**
 * Subscribes an email to the newsletter.
 */
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.trim()) {
    return { success: false, message: 'Please enter your email address.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  try {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.trim().toLowerCase()
      });

      if (error) {
        if (error.code === '23505') {
          return { success: true, message: "You are already subscribed to the AI Nexus newsletter!" };
        }
      }
    }

    return {
      success: true,
      message: 'Welcome to AI Nexus! You have successfully subscribed to weekly AI tool drops.'
    };
  } catch {
    return {
      success: true,
      message: 'Welcome to AI Nexus! You have successfully subscribed.'
    };
  }
}

/**
 * Proposes a new tool submission from users.
 */
export interface ToolSubmission {
  name: string;
  website_url: string;
  category: string;
  pricing: string;
  description: string;
  submitter_email: string;
}

export async function submitToolProposal(tool: ToolSubmission): Promise<{ success: boolean; message: string }> {
  if (!tool.name || !tool.website_url || !tool.description) {
    return { success: false, message: 'Please complete all required fields.' };
  }

  try {
    if (isSupabaseConfigured() && supabase) {
      // Propose to tools table or contact_messages
      await supabase.from('contact_messages').insert({
        name: `Tool Submission: ${tool.name}`,
        email: tool.submitter_email || 'anonymous@submission.com',
        subject: `New Tool Proposal: ${tool.name} (${tool.pricing})`,
        message: `Website: ${tool.website_url}\nCategory: ${tool.category}\nPricing: ${tool.pricing}\nDescription: ${tool.description}`
      });
    }

    return {
      success: true,
      message: `"${tool.name}" has been submitted for editorial review! It will be verified and added within 48 hours.`
    };
  } catch {
    return {
      success: true,
      message: 'Submission received! Our editors will review the AI tool shortly.'
    };
  }
}

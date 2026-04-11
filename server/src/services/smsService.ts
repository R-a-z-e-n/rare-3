import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const smsService = {
  sendOTP: async (phone: string, otp: string) => {
    const message = `Your RARE verification code is: ${otp}. Valid for 10 minutes.`;

    if (client && fromPhone) {
      try {
        await client.messages.create({
          body: message,
          from: fromPhone,
          to: phone.startsWith('+') ? phone : `+91${phone}`, // Default to +91 for India
        });
        console.log(`✅ SMS sent successfully to ${phone}`);
        return true;
      } catch (error) {
        console.error('❌ Twilio Error:', error);
        // Fallback to console log even if Twilio fails
      }
    }

    // Fallback: Just log it
    console.log(`\n--------------------------`);
    console.log(`🔑 [CONSOLE FALLBACK]`);
    console.log(`📱 To: ${phone}`);
    console.log(`💬 Message: ${message}`);
    console.log(`--------------------------\n`);
    
    return false;
  }
};

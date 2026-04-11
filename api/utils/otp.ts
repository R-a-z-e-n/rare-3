import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export const otpService = {
  sendOTP: async (phone: string, otp: string) => {
    const message = `Your RARE verification code is: ${otp}. Valid for 10 minutes.`;

    // If Twilio credentials are configured, send real SMS
    if (accountSid && authToken && twilioPhone) {
      try {
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: message,
          from: twilioPhone,
          to: phone,
        });
        console.log(`✅ OTP sent via Twilio to ${phone}`);
        return true;
      } catch (error: any) {
        console.error(`❌ Twilio SMS failed:`, error.message);
        // Fall back to console logging if Twilio fails
        console.log(`\n--------------------------`);
        console.log(`🔑 [FALLBACK - Twilio failed, logging OTP]`);
        console.log(`📱 To: ${phone}`);
        console.log(`💬 OTP: ${otp}`);
        console.log(`--------------------------\n`);
        return true;
      }
    }

    // Fallback: Dummy OTP (no Twilio credentials)
    console.log(`\n--------------------------`);
    console.log(`🔑 [DUMMY OTP SERVICE - NO TWILIO]`);
    console.log(`📱 To: ${phone}`);
    console.log(`💬 Message: ${message}`);
    console.log(`--------------------------\n`);

    return true;
  }
};

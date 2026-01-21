import axios from "axios";

export const sendOTPEmail = async (email, otp) => {
    const payload = {
        sender: {
            name: "GalgoChat",
            email: "noreply@galgochat.com",
        },
        to: [{ email }],
        subject: "Your GalgoChat OTP",
        htmlContent: `
      <h2>GalgoChat Login OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
    };

    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        payload,
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
            timeout: 10000,
        }
    );
};

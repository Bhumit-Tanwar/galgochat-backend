import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendOTPEmail = async (to, otp) => {
    await transporter.sendMail({
        from: `"GalgoChat" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Your GalgoChat OTP",
        html: `<h1>Your OTP: ${otp}</h1>`,
    });

    console.log("✅ OTP SENT VIA GMAIL");
};

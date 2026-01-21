import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/mail.js";
import { generateUsername } from "../utils/username.js";

const router = express.Router();
const otpStore = new Map();

router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email.endsWith("@galgotiasuniversity.ac.in")) {
            return res.status(403).json({ message: "Only Galgotias emails allowed" });
        }

        const otp = generateOTP();
        otpStore.set(email, otp);

        console.log(`OTP for ${email} : ${otp}`);

        await sendOTPEmail(email, otp);

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("Send OTP error:", err);
        res.status(500).json({ message: "OTP error" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (otpStore.get(email) !== otp) {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    let user = await User.findOne({ emailHash });
    if (!user) {
        user = await User.create({
            emailHash,
            username: generateUsername(),
        });
    }

    otpStore.delete(email);

    res.json({ username: user.username });
});

export default router;

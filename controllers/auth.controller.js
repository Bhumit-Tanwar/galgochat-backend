import crypto from "crypto";
import User from "../models/User.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/brevoMailer.js"; // 🔥 UPDATED
import { generateUsername } from "../utils/username.js";

// =========================
// In-memory OTP store
// Structure:
// email -> { otp, expiresAt }
// =========================
const otpStore = new Map();

/**
 * =========================
 * SEND OTP CONTROLLER
 * =========================
 */
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.endsWith("@galgotiasuniversity.ac.in")) {
            return res
                .status(403)
                .json({ message: "Only Galgotias University emails allowed" });
        }

        const otp = generateOTP();

        // Save OTP with expiry (5 minutes)
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
        });

        // ❌ REMOVE THIS IN REAL PRODUCTION
        console.log("OTP for", email, ":", otp);

        await sendOTPEmail(email, otp);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP error:", error.message);
        res.status(500).json({ message: "OTP error" });
    }
};

/**
 * =========================
 * VERIFY OTP CONTROLLER
 * =========================
 */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = otpStore.get(email);

        if (!record) {
            return res.status(401).json({ message: "OTP expired or not found" });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(401).json({ message: "OTP expired" });
        }

        if (record.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        // OTP verified → delete
        otpStore.delete(email);

        // Hash email for privacy
        const emailHash = crypto
            .createHash("sha256")
            .update(email)
            .digest("hex");

        let user = await User.findOne({ emailHash });

        if (!user) {
            user = await User.create({
                emailHash,
                username: generateUsername(),
            });
        }

        res.json({
            message: "OTP verified",
            username: user.username,
        });
    } catch (error) {
        console.error("Verify OTP error:", error.message);
        res.status(500).json({ message: "Verification error" });
    }
};

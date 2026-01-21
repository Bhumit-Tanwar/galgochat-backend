import crypto from "crypto";
import User from "../models/User.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/mail.js";
import { generateUsername } from "../utils/username.js";

// In-memory OTP store (later Redis)
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
        otpStore.set(email, otp);

        // 🔍 DEV ONLY (remove in production)
        console.log("OTP for", email, ":", otp);

        await sendOTPEmail(email, otp);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP error:", error);
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

        if (!otpStore.has(email) || otpStore.get(email) !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

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

        otpStore.delete(email);

        res.json({
            message: "OTP verified",
            username: user.username,
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Verification error" });
    }
};

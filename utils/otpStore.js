const otpStore = new Map();

export const saveOTP = (email, otp) => {
    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });
};

export const verifyOTP = (email, otp) => {
    const data = otpStore.get(email);
    if (!data) return false;

    if (Date.now() > data.expiresAt) {
        otpStore.delete(email);
        return false;
    }

    if (data.otp !== otp) return false;

    otpStore.delete(email);
    return true;
};

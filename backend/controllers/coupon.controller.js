import Coupon from "../models/coupon.model.js";


export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.status(200).json(coupon || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const validateCoupon = async (req, res) => {
    const { code } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }
        if (new Date() > coupon.expirationDate) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: 'Coupon has expired' });
        }
        res.status(200).json({ code: coupon, message: "coupon is valid" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

import userModel from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                patientId: user.patientId,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

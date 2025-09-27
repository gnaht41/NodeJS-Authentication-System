import User from "../models/userModel.js"; // Importing the User model

// Controller class for handling Google Sign In
// controllers/authController.js
export class googleSignInController {
    signInSuccess = async (req, res) => {
        // Với cấu hình ở passport, req.user là user doc (đã từ DB)
        const user = req.user;

        if (user?.email) {
            req.session.userEmail = user.email;
            return res.status(200).render("homepage");
        } else {
            return res.status(403).json({ error: true, message: "Not Authorized" });
        }
    }

    signInFailed = (req, res) => {
        res.status(401).json({ error: true, message: "Log in failure" });
    }
}

// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js"; // đường dẫn đúng model của bạn

dotenv.config();

// 1) Đăng ký chiến lược 'google'
passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback" // phải trùng với Redirect URI trong Google Cloud
    },
    // verify callback
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName;
            const sub = profile.id;

            if (!email) return done(null, false, { message: "No email from Google" });

            // Tìm hoặc tạo user
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    username: name,
                    email,
                    password: sub, // hoặc random hash; bạn có thể hash lại cho an toàn
                });
            }

            // Cho Passport biết đã xác thực thành công
            return done(null, user); // đưa user doc vào session
        } catch (err) {
            return done(err);
        }
    }
));

// 2) (De)Serialize user để lưu vào session
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean();
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;

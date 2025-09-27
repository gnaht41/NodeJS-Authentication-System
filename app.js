// app.js
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";

import { connectUsingMongoose } from "./config/mongodb.js";
import passport from "./config/passport.js";        // <-- import cấu hình passport
import userRouter from "./routes/routes.js";
import authRouter from "./routes/authRoutes.js";
import injectStudent from "./middlewares/studentInfo.js";

dotenv.config();
const app = express();

// view + static
app.set("view engine", "ejs");
app.set("layout", "layout");
app.use(expressLayouts);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session trước, rồi passport
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());   // <-- bắt buộc
app.use(passport.session());      // <-- bắt buộc

app.use(injectStudent);

await connectUsingMongoose();

app.use("/user", userRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => res.redirect("/user/signin"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

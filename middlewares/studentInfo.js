// middlewares/studentInfo.js
export default function injectStudent(req, res, next) {
    res.locals.studentId = process.env.STUDENT_ID || "22658561";
    res.locals.studentName = process.env.STUDENT_NAME || "Nguyễn Đức Quốc Thắng";
    next();
}

import jwt from "jsonwebtoken";

export const generateToken = (userId, roleOrRes, res) => {
    let actualRes = res;
    let actualRole = "user";

    if (typeof roleOrRes === "string") {
        actualRole = roleOrRes;
    } else if (roleOrRes && typeof roleOrRes.cookie === "function") {
        actualRes = roleOrRes;
    }

    const JWT_SECRET = process.env.JWT_SECRET || "dsljkvnlsjk";

    const token = jwt.sign(
        { userId, role: actualRole },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    if (actualRes && typeof actualRes.cookie === "function") {
        actualRes.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
    }

    return token;
};

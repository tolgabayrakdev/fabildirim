import jwt from 'jsonwebtoken';


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecret';


export function generateAccessToken(payload) {
    return jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
}

export function verifyToken(token, type = "access") {
    if (!token) {
        throw new HttpException(401, "Oturum açılmamış");
    }

    const secret = type === "access" ? accessTokenSecret : refreshTokenSecret;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new HttpException(403, "Oturum süresi dolmuş");
        }
        if (err.name === "JsonWebTokenError") {
            throw new HttpException(401, "Oturum açılmamış");
        }
        throw err;
    }
}
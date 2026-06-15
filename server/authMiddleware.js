import { getAuth } from "./firebase.js";

/**
 * Express middleware that verifies a Firebase ID token from the
 * `Authorization: Bearer <token>` header and attaches `req.user`.
 */
export async function requireAuth(req, res, next) {
    const header = req.get("authorization") || "";
    const match = header.match(/^Bearer (.+)$/i);
    if (!match) {
        return res.status(401).json({ error: "Missing or malformed Authorization header." });
    }
    try {
        const decoded = await getAuth().verifyIdToken(match[1]);
        req.user = {
            uid: decoded.uid,
            email: decoded.email || null,
            name: decoded.name || decoded.email || "Listener",
        };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
}

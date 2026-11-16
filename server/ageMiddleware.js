import { getUser, isAge16Plus } from "./users.js";

/** Blocks upload/create routes unless the user has a verified 16+ birth date. */
export async function requireAge16(req, res, next) {
    try {
        const profile = await getUser(req.user.uid);
        if (!profile?.birthDate || !isAge16Plus(profile.birthDate)) {
            return res.status(403).json({
                error: "You must be 16 or older to upload music, create podcasts, or create folders.",
                code: "AGE_REQUIRED",
            });
        }
        next();
    } catch (err) {
        console.error("age check failed:", err);
        res.status(500).json({ error: "Could not verify age." });
    }
}

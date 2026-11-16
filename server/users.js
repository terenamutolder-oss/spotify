import { getFirestore } from "./firebase.js";

function usersCollection() {
    return getFirestore().collection("users");
}

/** Parse a YYYY-MM-DD string into a Date at UTC midnight. */
export function parseBirthDate(value) {
    if (!value) return null;
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

export function calcAge(birthDate) {
    const dob = birthDate instanceof Date ? birthDate : parseBirthDate(birthDate);
    if (!dob) return null;
    const today = new Date();
    let age = today.getUTCFullYear() - dob.getUTCFullYear();
    const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
        age -= 1;
    }
    return age;
}

export function isAge16Plus(birthDate) {
    const age = calcAge(birthDate);
    return age !== null && age >= 16;
}

export async function getUser(uid) {
    const doc = await usersCollection().doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
        uid: doc.id,
        email: data.email || null,
        name: data.name || "Listener",
        birthDate: data.birthDate || null,
        // Music uploads are available to every signed-in account.
        canUpload: true,
        canCreateMature: isAge16Plus(data.birthDate),
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    };
}

export async function ensureUser(uid, { email, name, birthDate } = {}) {
    const ref = usersCollection().doc(uid);
    const existing = await ref.get();
    const parsed = birthDate ? parseBirthDate(birthDate) : null;
    if (birthDate && !parsed) {
        throw new Error("Invalid birth date. Use YYYY-MM-DD.");
    }

    if (!existing.exists) {
        const doc = {
            email: email || null,
            name: name || "Listener",
            birthDate: parsed ? birthDate : null,
            createdAt: new Date(),
        };
        await ref.set(doc);
        return getUser(uid);
    }

    const updates = {};
    if (email && !existing.data().email) updates.email = email;
    if (name && !existing.data().name) updates.name = name;
    if (parsed && !existing.data().birthDate) updates.birthDate = birthDate;
    if (Object.keys(updates).length) await ref.update(updates);
    return getUser(uid);
}

export async function setBirthDate(uid, birthDate) {
    const parsed = parseBirthDate(birthDate);
    if (!parsed) throw new Error("Invalid birth date. Use YYYY-MM-DD.");
    await usersCollection().doc(uid).set({ birthDate }, { merge: true });
    return getUser(uid);
}

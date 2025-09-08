// src/services/setting-service.ts
import api from "./api";

type GetRes = { value: string };
type PutRes = { key: string; value: string; updatedBy?: string; updatedAt?: string };

export const settingsService = {
    // 
    getDonationsStart: async (): Promise<Date> => {
        const { data } = await api.get<GetRes>("/settings/donations-start");
        return new Date(data.value);
    },
    // שמירת תאריך התחלה חדש
    postSettings: async (date: Date | string) => {
        const iso = typeof date === "string" ? new Date(date).toISOString() : date.toISOString();
        const { data } = await api.put<PutRes>("/settings/donations-start", { value: iso });
        return {
            ...data,
            value: new Date(data.value),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        };
    },
    getRefGoal: async (ref: string): Promise<number> => {
        try {
            const { data } = await api.get<{ ref: string; goal: number | string }>(
                `/settings/goal/${encodeURIComponent(ref)}`
            );
            const n = Number(data?.goal ?? 0);
            return Number.isFinite(n) ? n : 0;
        } catch (e: any) {
            if (e?.response?.status === 404) return 0; // אין יעד -> 0
            throw e;
        }
    },


    // שמירת יעד לפי ref
    setRefGoal: async (ref: string, goal: number) => {
        const { data } = await api.put(`/settings/goal/${encodeURIComponent(ref)}`, { goal });
        return data;
    },



    getAllRefGoals: async (): Promise<Record<string, number>> => {
        // ודאי שהנתיב תואם לראוטר שלך: GET /api/settings/ref-goals
        const { data } = await api.get("/settings/goals");
        const raw = data?.goals ?? data?.refGoals ?? data ?? {};
        // תמיכה גם במקרה שמוחזר מערך [{ ref, goal }]
        const map =
            Array.isArray(raw)
                ? Object.fromEntries(
                    raw
                        .filter((x: any) => x?.ref != null)
                        .map((x: any) => [String(x.ref).toLowerCase(), Number(x.goal) || 0])
                )
                : raw;

        const out: Record<string, number> = {};
        for (const [k, v] of Object.entries(map)) {
            out[String(k).toLowerCase()] = Number(v) || 0;
        }
        return out;
    },




};



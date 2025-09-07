// src/services/setting-service.ts
import api from "./api";

type GetRes = { value: string };
type PutRes = { key: string; value: string; updatedBy?: string; updatedAt?: string };

export const settingsService = {
    getSettings: async (): Promise<Date> => {
        const { data } = await api.get<GetRes>("/settings/donations-start");
        return new Date(data.value);
    },
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
        const { data } = await api.get(`/settings/goal/${encodeURIComponent(ref)}`);
        return Number(data?.goal || 0);
    },
};

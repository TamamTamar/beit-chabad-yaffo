// src/routes/admin/AdminRefGoalsView.tsx
import { useEffect, useMemo, useState } from "react";
import { Table, Spinner } from "flowbite-react";
import { settingsService } from "../../services/setting-service";
import { getAllDonationsByRef } from "../../services/donation-service";

// אם יש לך טיפוס גלובלי, אפשר להעביר לקובץ types
type TotalsByRef = { ref: string; totalAmount: number; donationCount: number };
type Row = { ref: string; name: string; goal: number; raised: number };

const AdminRefGoals = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const ils = useMemo(
        () =>
            new Intl.NumberFormat("he-IL", {
                style: "currency",
                currency: "ILS",
                maximumFractionDigits: 0,
            }),
        []
    );

    const baseUrl =
        (import.meta as any).env?.VITE_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "https://www.chabadyafo.org");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);

                // 1) טוענים את יעדי כל ה־ref
                const goalsMap = await settingsService.getAllRefGoals(); // לדוגמה: { dl: 50000, yt: 12000, ... }

                // 2) טוענים סכומים בפועל לכל ref מהשרת
                //    מצפה ל־[{ ref: "dl", totalAmount: 12345, donationCount: 7 }, ...]
                const totalsList = await getAllDonationsByRef();


                // 3) מאחדים לפי ref
                const refs = Array.from(
                    new Set([
                        ...Object.keys(goalsMap || {}),
                        ...totalsList.map((t) => String(t.ref || "")),
                    ])
                ).filter(Boolean);

                // 4) מביאים שם ידידותי לכל ref (במקביל, עם fallback ל־ref)
                const namesEntries = await Promise.allSettled(
                    refs.map(async (r) => [r, await settingsService.getRefName(r)] as const)
                );
                const namesMap = Object.fromEntries(
                    namesEntries.map((p) => {
                        if (p.status === "fulfilled") {
                            const [r, name] = p.value;
                            return [r, String(name || "").trim()];
                        }
                        return ["", ""];
                    }).filter(([r]) => !!r)
                );

                // 5) יוצרים שורות לתצוגה
                const totalsMap = Object.fromEntries(
                    totalsList.map((t) => [String(t.ref || ""), Number(t.totalAmount) || 0])
                );

                const list: Row[] = refs
                    .map((ref) => ({
                        ref,
                        name: namesMap[ref] || ref,
                        goal: Number(goalsMap?.[ref]) || 0,
                        raised: Number(totalsMap[ref]) || 0,
                    }))
                    // מיון לפי ref (אפשר לשנות ל־raised/goal)
                    .sort((a, b) => a.ref.localeCompare(b.ref));

                setRows(list);
            } catch (e: any) {
                setErr(e?.message || "שגיאה בטעינת היעדים והסכומים");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="admin-ref-goals-view" dir="rtl">
            <h2 className="text-xl font-bold mb-3">יעדים וסכומים לפי ref</h2>

            {loading && (
                <div className="text-center py-6">
                    <Spinner size="lg" /> טוען…
                </div>
            )}
            {err && <div className="text-center text-red-600 py-2">{err}</div>}
            {!loading && !err && rows.length === 0 && (
                <div className="text-center py-4">אין נתונים להצגה.</div>
            )}

            {!loading && !err && rows.length > 0 && (
                <Table hoverable>
                    <Table.Head className="text-center">
                        <Table.HeadCell>שם</Table.HeadCell>
                        <Table.HeadCell>ref</Table.HeadCell>
                        <Table.HeadCell>יעד</Table.HeadCell>
                        <Table.HeadCell>הותרם</Table.HeadCell>
                        {/* אופציונלי: אחוז התקדמות
            <Table.HeadCell>התקדמות</Table.HeadCell>
            */}
                        <Table.HeadCell>קישור</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {rows.map((r) => {
                            const url = `${baseUrl}/?ref=${encodeURIComponent(r.ref)}`;
                            return (
                                <Table.Row key={r.ref} className="text-right">
                                    <Table.Cell>{r.name}</Table.Cell>
                                    <Table.Cell className="font-mono">{r.ref}</Table.Cell>
                                    <Table.Cell>{r.goal ? ils.format(r.goal) : "—"}</Table.Cell>
                                    <Table.Cell>{ils.format(r.raised)}</Table.Cell>
                                    {/* אופציונלי: הצגת אחוז
                  <Table.Cell>
                    {r.goal > 0 ? `${Math.min((r.raised / r.goal) * 100, 100).toFixed(1)}%` : "—"}
                  </Table.Cell>
                  */}
                                    <Table.Cell>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            פתח
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
};

export default AdminRefGoals;

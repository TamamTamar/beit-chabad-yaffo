// src/routes/admin/AdminRefGoalsView.tsx
import { useEffect, useMemo, useState } from "react";
import { Table, Spinner } from "flowbite-react";
import { settingsService } from "../../services/setting-service";

type Row = { ref: string; goal: number };

const AdminRefGoalsView = () => {
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

                // משתמשים אך ורק ב־getAllRefGoals
                const goalsMap = await settingsService.getAllRefGoals(); // { dl: 50000, yt: 12000, ... }
                const list: Row[] = Object.entries(goalsMap)
                    .map(([ref, goal]) => ({ ref, goal: Number(goal) || 0 }))
                    .sort((a, b) => a.ref.localeCompare(b.ref));

                setRows(list);
            } catch (e: any) {
                setErr(e?.message || "שגיאה בטעינת היעדים");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="admin-ref-goals-view" dir="rtl">
            <h2 className="text-xl font-bold mb-3">יעדים לפי ref</h2>

            {loading && (
                <div className="text-center py-6">
                    <Spinner size="lg" /> טוען…
                </div>
            )}
            {err && <div className="text-center text-red-600 py-2">{err}</div>}
            {!loading && !err && rows.length === 0 && (
                <div className="text-center py-4">אין יעדים מוגדרים.</div>
            )}

            {!loading && !err && rows.length > 0 && (
                <Table hoverable>
                    <Table.Head className="text-center">
                        <Table.HeadCell>ref</Table.HeadCell>
                        <Table.HeadCell>יעד</Table.HeadCell>
                        <Table.HeadCell>קישור</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {rows.map((r) => {
                            const url = `${baseUrl}/?ref=${encodeURIComponent(r.ref)}`;
                            return (
                                <Table.Row key={r.ref} className="text-right">
                                    <Table.Cell className="font-mono">{r.ref}</Table.Cell>
                                    <Table.Cell>{r.goal ? ils.format(r.goal) : "—"}</Table.Cell>
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

export default AdminRefGoalsView;

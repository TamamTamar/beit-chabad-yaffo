import { Table, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Parasha } from '../../@Types/chabadType';
import { useSearch } from '../../hooks/useSearch';
import { deleteParashaById, getAllParashot } from '../../services/parasha-service';
import dialogs from '../../ui/dialogs';
import './AdminParashot.scss'; // ייבוא קובץ Sass

const AdminParashot = () => {
    const { searchTerm } = useSearch();
    const [parashot, setParashot] = useState<Parasha[]>([]);
    const [filteredParashot, setFilteredParashot] = useState<Parasha[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllParashot()
            .then(data => {
                if (Array.isArray(data)) {
                    setParashot(data);
                    setFilteredParashot(data);
                } else {
                    setError(new Error("Unexpected response format"));
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredParashot(
            parashot.filter(parasha =>
                parasha.title.toLowerCase().includes(lowercasedSearchTerm) ||
                parasha.source.toLowerCase().includes(lowercasedSearchTerm) ||
                parasha.miniText.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [searchTerm, parashot]);

    const handleDeleteParasha = async (parashaId: string) => {
        const result = await dialogs.confirm("מחיקת פרשה", "האם אתה בטוח שברצונך למחוק את הפרשה?");
        if (result.isConfirmed) {
            try {
                await deleteParashaById(parashaId);
                setParashot(parashot.filter(parasha => parasha._id !== parashaId));
                dialogs.success("פרשה נמחקה", "הפרשה נמחקה בהצלחה.");
            } catch (err) {
                dialogs.error("שגיאה", "לא הצלחנו למחוק את הפרשה.");
            }
        }
    };

    return (
        <div className="admin-parashot-container">
            <h2 className="admin-parashot-header">רשימת פרשות</h2>
            <div className="admin-parashot-add-button">
                <Tooltip content="הוסף פרשה" placement="top">
                    <a href="admin/parasha/create" className="button-add-parasha">
                        <FiPlus size={20} />
                    </a>
                </Tooltip>
            </div>
            {loading && <div className="text-center">טוען...</div>}
            {error && <div className="error-message">{error.message}</div>}
            {!loading && filteredParashot.length === 0 && <div className="text-center">לא נמצאו פרשות.</div>}

            <div className="admin-parashot-table">
                {!loading && filteredParashot.length > 0 && (
                    <Table hoverable>
                        <Table.Head className="text-center">
                            <Table.HeadCell>תמונה</Table.HeadCell>
                            <Table.HeadCell>מקור</Table.HeadCell>
                            <Table.HeadCell>כותרת</Table.HeadCell>
                            <Table.HeadCell>תקציר</Table.HeadCell>
                            <Table.HeadCell>תאריך יצירה</Table.HeadCell>
                            <Table.HeadCell>פעולות</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredParashot.map((parasha) => (
                                <Table.Row key={parasha._id} className="text-right">
                                    <Table.Cell>
                                        <img
                                            src={parasha.image.url}
                                            className="parasha-image"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{parasha.source}</Table.Cell>
                                    <Table.Cell>{parasha.title}</Table.Cell>
                                    <Table.Cell>{parasha.miniText}</Table.Cell>
                                    <Table.Cell>{new Date(parasha.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell className="flex-col">
                                        <div className="parasha-actions">
                                            <Link to={`/beitChabad/admin/parasha/edit/${parasha._id}`} className="parasha-actions-link">
                                                ערוך
                                            </Link>
                                            <button onClick={() => handleDeleteParasha(parasha._id)} className="parasha-actions-button">
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default AdminParashot;

import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';

import { Donation } from '../../@Types/chabadType';
import { getAllDonations } from '../../services/donation-service';
import './AdminDonation.scss'; // ייבוא קובץ Sass חדש

const AdminDonation = () => {
    const { searchTerm } = useSearch();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllDonations()
            .then(data => {
                if (Array.isArray(data)) {
                    setDonations(data);
                    setFilteredDonations(data);
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
        setFilteredDonations(
            donations.filter(donation =>
                donation.FirstName.toLowerCase().includes(lowercasedSearchTerm) ||
                donation.LastName.toLowerCase().includes(lowercasedSearchTerm)
        
        ));
    }, [searchTerm, donations]);

    return (
        <div className="admin-donation-container">
            <h2 className="admin-donation-header">רשימת תרומות</h2>
            {loading && <div className="text-center">טוען...</div>}
            {error && <div className="error-message">{error.message}</div>}
            {!loading && filteredDonations.length === 0 && <div className="text-center">לא נמצאו תרומות.</div>}

            <div className="admin-donation-table">
                {!loading && filteredDonations.length > 0 && (
                    <Table hoverable>
                        <Table.Head className="text-center">
                            <Table.HeadCell>שם פרטי</Table.HeadCell>
                            <Table.HeadCell>שם משפחה</Table.HeadCell>
                            <Table.HeadCell>טלפון</Table.HeadCell>
                            <Table.HeadCell>סכום</Table.HeadCell>
                            <Table.HeadCell>מספר תשלומים</Table.HeadCell>
                            <Table.HeadCell>לזכות</Table.HeadCell>
                            <Table.HeadCell>הערות</Table.HeadCell>

                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredDonations.map((donation) => (
                                <Table.Row key={(donation as any)._id} className="text-right">
                                    <Table.Cell>{donation.FirstName}</Table.Cell>
                                    <Table.Cell>{donation.LastName}</Table.Cell>
                                    <Table.Cell>{donation.Amount.toFixed(2)}</Table.Cell>
                                    <Table.Cell>{donation.Tashlumim}</Table.Cell>
                        
                                    <Table.Cell>
                                        {donation.lizchut ? (
                                          donation.lizchut
                                        ) : (
                                            '-'
                                        )}
                                    </Table.Cell>
                                     <Table.Cell>{donation.Comments}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default AdminDonation;

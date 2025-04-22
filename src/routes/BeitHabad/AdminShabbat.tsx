import React, { useEffect, useState } from 'react';
import { RishumShabbatType } from '../../@Types/chabadType';
import { getAllRishum } from '../../services/shabbatService';
import { Table } from 'flowbite-react';

const AdminShabbat = () => {
    const [rishum, setRishum] = useState<RishumShabbatType[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterParasha, setFilterParasha] = useState('');

    useEffect(() => {
        getAllRishum()
            .then(data => {
                if (Array.isArray(data)) {
                    setRishum(data);
                } else {
                    setError(new Error('Unexpected response format'));
                }
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredRishum = filterParasha
        ? rishum.filter((item) => item.parasha.includes(filterParasha))
        : rishum;

    if (loading) return <div>טוען נתונים...</div>;
    if (error) return <div>שגיאה: {error.message}</div>;

    return (
        <div className="admin-shabbat">
            <h1 className="text-2xl font-bold mb-4">ניהול רישומים לשבת</h1>

            <div className="mb-4">
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                    סינון לפי פרשה:
                </label>
                <input
                    id="filter"
                    type="text"
                    value={filterParasha}
                    onChange={(e) => setFilterParasha(e.target.value)}
                    placeholder="הכנס שם פרשה"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <Table hoverable={true}>
                <Table.Head>
                    <Table.HeadCell>פרשה</Table.HeadCell>
                    <Table.HeadCell>תאריך</Table.HeadCell>
                    <Table.HeadCell>סה"כ לתשלום</Table.HeadCell>
                    <Table.HeadCell>מוצרים</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {filteredRishum.map((item) => (
                        <Table.Row key={item._id} className="bg-white">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                {item.parasha}
                            </Table.Cell>
                            <Table.Cell>{item.date}</Table.Cell>
                            <Table.Cell>€{item.totalPrice}</Table.Cell>
                            <Table.Cell>
                                <ul>
                                    {item.products.map((product, index) => (
                                        <li key={index}>
                                            {product.name} - כמות: {product.quantity} - מחיר: €{product.price}
                                        </li>
                                    ))}
                                </ul>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default AdminShabbat;
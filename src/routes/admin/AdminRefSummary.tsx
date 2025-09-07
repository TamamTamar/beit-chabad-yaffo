import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { RefSummary } from '../../@Types/chabadType';
import { getAllDonationsByRef } from '../../services/donation-service';

const AdminRefSummary = () => {
  const [summaries, setSummaries] = useState<RefSummary[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDonationsByRef()
      .then(data => setSummaries(data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-ref-summary-container">
      <h2 className="admin-donation-header">סיכום לפי מתרים</h2>
      {loading && <div className="text-center">טוען...</div>}
      {error && <div className="error-message">{error.message}</div>}
      {!loading && summaries.length === 0 && <div className="text-center">אין נתונים.</div>}

      {!loading && summaries.length > 0 && (
        <Table hoverable>
          <Table.Head className="text-center">
            <Table.HeadCell>מזהה מתרים (ref)</Table.HeadCell>
            <Table.HeadCell>סכום כולל (₪)</Table.HeadCell>
            <Table.HeadCell>מספר תרומות</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {summaries.map((row, index) => (
              <Table.Row key={index} className="text-right">
                <Table.Cell>{row.ref}</Table.Cell>
                <Table.Cell>{row.totalAmount.toFixed(2)}</Table.Cell>
                <Table.Cell>{row.donationCount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default AdminRefSummary;

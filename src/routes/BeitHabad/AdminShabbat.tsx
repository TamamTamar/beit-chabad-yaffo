import React, { useEffect, useState } from 'react'
import { RishumShabbatType } from '../../@Types/chabadType';
import { getAllRishum } from '../../services/shabbatService';

const AdminShabbat = () => {
     const [rishum, setRishum] = useState<RishumShabbatType[]>([]);
     const [error, setError] = useState<Error | null>(null);
     const [loading, setLoading] = useState(true);

         useEffect(() => {
             getAllRishum()
                 .then(data => {
                     if (Array.isArray(data)) {
                         setRishum(data);
                     } else {
                         setError(new Error("Unexpected response format"));
                     }
                 })
                 .catch(err => {
                     setError(err);
                 })
                 .finally(() => setLoading(false));
         }, []);
  return (
    <div>AdminShabbat</div>
  )
}

export default AdminShabbat
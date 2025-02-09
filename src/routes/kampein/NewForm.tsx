import React from 'react';
import { useForm } from 'react-hook-form';

function DonationForm({ monthlyAmount }) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      FirstName: '',
      LastName: '',
      Street: '',
      City: '',
      Phone: '',
      Mail: '',
      annualDonation: false,
      Country: 'IL',
      Zip: '',
      Comments: '',
      MosadId: 'xxxxxxx', // מזהה מוסד
      ApiValid: 'xxxxxxx', // טקסט אימות
      Zeout: '', // מספר תעודת זהות
      PaymentType: 'Ragil', // סוג תשלום
      Amount: monthlyAmount,
      Tashlumim: 1, // מספר תשלומים
      Currency: 1, // מטבע: 1 (שקל)
      Groupe: '',
      Param1: '',
      Param2: '',
      CallBack: '',
      CallBackMailError: '',
    },
  });

  const onSubmit = (data) => {
    const amount = data.annualDonation ? monthlyAmount * 12 : monthlyAmount;
    // שלח את הנתונים ל-API של נדרים פלוס
  };

  const annualDonation = watch('annualDonation');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('FirstName')} placeholder="First Name" required />
      <input {...register('LastName')} placeholder="Last Name" required />
      <input {...register('Street')} placeholder="Street" required />
      <input {...register('City')} placeholder="City" required />
      <input {...register('Phone')} placeholder="Phone" required />
      <input {...register('Mail')} type="email" placeholder="Email" required />
      <label>
        <input type="checkbox" {...register('annualDonation')} />
        תרומה שנתית
      </label>
      <p>סכום לתשלום: {annualDonation ? monthlyAmount * 12 : monthlyAmount} ש"ח</p>
      <button type="submit">תרום</button>
    </form>
  );
}

export default DonationForm;

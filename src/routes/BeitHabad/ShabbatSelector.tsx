import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ShabbatSelector.scss';
import ProductItem from './ProductItem';
import './shabbat.scss';

const ShabbatSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { parasha } = location.state || {};

    const getCustomParashaName = (parasha: string): string => {
        if (parasha === "פסח א׳" || parasha === "Pesach I") {
            return "ליל הסדר";
        }
        if (parasha === "פסח ז׳" || parasha === "Pesach VII") {
            return "שביעי של פסח";
        }
        if (parasha === "ראש השנה 5786" || parasha === "Rosh Hashana 5786") {
            return "ראש השנה";
        }
        if (parasha === "ראש השנה ב׳" || parasha === "Rosh Hashana II") {
            return "יום שני של ראש השנה";
        }
        if (parasha === "יום כפור" || parasha === "Yom Kippur") {
            return "יום כיפור - סעודה מפסקת";
        }
        if (parasha === "סוכות א׳" || parasha === "Sukkot I") {
            return "חג ראשון של סוכות";
        }
        return parasha;
    };

    const products = [
        { name: "כיסוי עלויות למבוגר", price: 42, quantity: 0 },
        { name: "כיסוי עלויות לילד (עד גיל 12)", price: 32, quantity: 0 },
        { name: "תומך", price: 82, quantity: 0 },
    ];

    const [productList, setProductList] = useState(products);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleQuantityChange = (index: number, quantity: number) => {
        const updatedProducts = [...productList];
        updatedProducts[index].quantity = quantity;
        setProductList(updatedProducts);

        // עדכון המחיר הכולל
        const newTotalPrice = updatedProducts.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
        setTotalPrice(newTotalPrice);
    };

    return (
        <>
            <div className="registration-page">
                <h1 className='registration-title'>{parasha ? getCustomParashaName(parasha.parasha) : "פרשה לא נבחרה"}</h1>
                <p className='registration-date'>תאריך: {parasha?.date}</p>
                <button className="back-button" onClick={() => navigate('/shabbat')}>לתאריכים נוספים</button>
            </div>
            <div className="product-list">
                {productList.map((product, index) => (
                    <ProductItem
                        key={index}
                        name={product.name}
                        price={product.price}
                        quantity={product.quantity}
                        onQuantityChange={(quantity) => handleQuantityChange(index, quantity)}
                    />
                ))}
            </div>
            <div className="total-price">
                <span>סה"כ לתשלום: €</span>
                <span className="price-amount">{totalPrice}</span>
            </div>
            <button className="confirm-button" onClick={() => navigate('/payment')}>אישור</button>
        </>
    );
};

export default ShabbatSelector;
import React from 'react';

interface ProductItemProps {
    name: string;
    price: number;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ name, price, quantity, onQuantityChange }) => {
    return (
        <div className="product-item">
            <span className="product-name">{name}</span>
            <span className="product-price">€{price}</span>
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => onQuantityChange(Number(e.target.value))}
                className="product-quantity"
            />
        </div>
    );
};

export default ProductItem;
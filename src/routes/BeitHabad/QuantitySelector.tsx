import { useState } from "react";

interface QuantitySelectorProps {
  onChange: (value: number) => void;
}

export default function QuantitySelector({ onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(0);

  const handleIncrease = () => {
    setQuantity((prev) => {
      const newValue = prev + 1;
      onChange(newValue);
      return newValue;
    });
  };

  const handleDecrease = () => {
    setQuantity((prev) => {
      if (prev === 0) return 0;
      const newValue = prev - 1;
      onChange(newValue);
      return newValue;
    });
  };

  return (
    <div className="quantity-selector">
      <button onClick={handleDecrease} className="circle-btn">-</button>
      <span>{quantity}</span>
      <button onClick={handleIncrease} className="circle-btn">+</button>
    </div>
  );
}

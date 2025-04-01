import QuantitySelector from "./QuantitySelector";

interface ProductItemProps {
    name: string;
    price: number;
  }
  
  export default function ProductItem({ name, price }: ProductItemProps) {
    return (
      <div className="product-item">
        <span className="price">€{price.toFixed(2)}</span>
        <span className="name">{name}</span>
        <QuantitySelector onChange={(value) => console.log("Quantity:", value)} />
      </div>
    );
  }
  
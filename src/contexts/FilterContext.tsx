import { createContext, useState, ReactNode } from "react";

export type FilterContextType = {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    size: string;
    sortPrice: string;
    setMinPrice: (value: number | undefined) => void;
    setMaxPrice: (value: number | undefined) => void;
    setSize: (value: string) => void;
    setSortPrice: (value: string) => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [size, setSize] = useState<string>('');
    const [sortPrice, setSortPrice] = useState<string>('');

    return (
        <FilterContext.Provider value={{ minPrice, maxPrice, size, sortPrice, setMinPrice, setMaxPrice, setSize, setSortPrice }}>
            {children}
        </FilterContext.Provider>
    );
};

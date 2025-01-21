/* import { createContext, useState, ReactNode } from "react";
import { SearchContextType } from "../@Types/types";


export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
}; */

// SearchContext.tsx
import { createContext, useState, ReactNode } from "react";
import { SearchContextType } from "../@Types/types";

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    return (
        <SearchContext.Provider value={{
            searchTerm,
            setSearchTerm,
            minPrice,
            setMinPrice,
            maxPrice,
            setMaxPrice,
            selectedSizes,
            setSelectedSizes,
        }}>
            {children}
        </SearchContext.Provider>
    );
};



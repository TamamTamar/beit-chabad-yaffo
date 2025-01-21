
export type IName = {
    first: string;
    middle?: string;
    last: string;
};

export type IAddress = {
    street: string;
    city: string;
    state?: string;
    zip?: string;
    country: string;
    houseNumber: number;
};



export type RegisterUser = {
    name: {
        first: string;
        middle?: string;
        last: string;
    };
    phone: string;
    email: string;
    password: string;
    /* image?: {
        url: string;
    };
    alt: string; */
    address: {
        state?: string;
        country: string;
        city: string;
        street: string;
        houseNumber: number;
        zip: number;
    };
};

export type ILogin = {
    email: string;
    password: string;
};

export type IUserInput = {
    email: string;
    phone: string;
    password: string;
    address: IAddress;
    name: IName;
    /* image?: IImage;
    alt: string; */
};

export type IUser = IUserInput & {
    _id: string;
    createdAt: Date;
    isAdmin: boolean;
    cart: ICartProduct[];
};

export interface ContextProviderProps {
    children: ReactNode;
}

export type ILogin = {
    email: string;
    password: string;
};

export type IJWTPayload = {
    _id: string;
    isAdmin: boolean;
  /*   isBusiness: boolean; */
};

export interface AuthContextType {
    token: string | null;
    user: IUser | undefined;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>
    register: (form: IUser) => Promise<void>
    logout: () => void;
    onUpdateUser: (user: IUser) => void;
}

export type ErrorType = {
    status: number;
    message: string;
    details: string;
};

export interface DecodedToken {
    _id: string;
    isAdmin: boolean;
}


/* interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
} */

    // types.ts
export interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    minPrice: number;
    setMinPrice: (price: number) => void;
    maxPrice: number;
    setMaxPrice: (price: number) => void;
    selectedSizes: string[];
    setSelectedSizes: (sizes: string[]) => void;
}


export type FCC = ({ children }: { children: ReactNode }) => ReactNode;

export type updateUserType = {
    name: {
        first: string;
        middle: string;
        last: string;
    };
    phone: string;
    address: {
        state: string;
        country: string;
        city: string;
        street: string;
        houseNumber: number;
        zip: number;
    };
};

export type IMessage = {
    _id?: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: Date;
}
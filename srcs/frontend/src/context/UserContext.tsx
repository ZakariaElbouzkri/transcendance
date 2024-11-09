"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define a type for the context value
interface UserContextType {
    currentPage: string;
    updateCurrentPage: (pageName: string) => void;
    userData: UserDataType;
    updateUserData: (data: UserDataType) => void;
    search: string;
    updateSearch: (data: string) => void;
    searchedUserData: SearchedUserDataType;
    updateSearchedUserData: (data: SearchedUserDataType) => void;
}

// Define a type for the user data
interface UserDataType {
    id: number | null;
    otp_uri: string;
    last_login: string;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    two_fa_enabled: boolean;
    is_online: string;
    avatar_url: string | null;
    wins: number;
    loses: number;
    rating: number;
    rank: number;
}

// Define a type for the searched user data
interface SearchedUserDataType {
    avatar_url: string;
    first_name: string;
    id: number;
    is_online: boolean;
    last_name: string;
    loses: number;
    rank: number;
    rating: number;
    username: string;
    wins: number;
}

// Create the context with a default value of `undefined` for type safety
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the type for the provider's props
interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [currentPage, setCurrentPage] = useState<string>("");
    const [userData, setUserData] = useState<UserDataType>({
        id: null,
        otp_uri: "",
        last_login: "",
        is_superuser: false,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_staff: false,
        is_active: false,
        date_joined: "",
        two_fa_enabled: false,
        is_online: "",
        avatar_url: "",
        wins: 0,
        loses: 0,
        rating: 0,
        rank: 0,
    });
    const [searchedUserData, setSearchedUserData] = useState<SearchedUserDataType>({
        avatar_url: "",
        first_name: "",
        id: 0,
        is_online: false,
        last_name: "",
        loses: 0,
        rank: 0,
        rating: 0,
        username: "",
        wins: 0,
    });

    const [search, setSearch] = useState<string>("");

    const updateSearchedUserData = (data: SearchedUserDataType) => {
        setSearchedUserData(data);
    };

    const updateCurrentPage = (pageName: string) => {
        setCurrentPage(pageName);
    };

    const updateSearch = (data: string) => {
        setSearch(data);
    };

    const updateUserData = (data: UserDataType) => {
        setUserData(data);
        console.log("data", data);
    };

    return (
        <UserContext.Provider value={{
            currentPage,
            updateCurrentPage,
            userData,
            updateUserData,
            search,
            updateSearch,
            searchedUserData,
            updateSearchedUserData
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easier access to the context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};

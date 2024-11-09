"use client";

import React, { useState, ChangeEvent } from "react";
import classes from './SearchBar.module.css';
import searchLogoBlack from '../../../../assets/SearchBlack.svg';
import Image from "next/image";
import avatarImage from '../../../../assets/player.png';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUserContext } from "@/context/UserContext";

// Define the type for a single search result item
interface SearchResult {
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

// Define the structure for paginated search results
interface PaginatedSearchResults {
    res: SearchResult[];
    next: string | null;
}

// Define the props type for SearchResultComponent
interface SearchResultComponentProps {
    searchResults: PaginatedSearchResults;
}

const SearchResultComponent: React.FC<SearchResultComponentProps> = ({ searchResults }) => {
    const router = useRouter();

    const handleClick = (result) => {

        console.log(result);


        router.push(`/users/friend/${result.id}`);
    };

    return (
        <div className={classes.resultContainer}>
            {searchResults.res.map((result) => (
                <button onClick={() => handleClick(result)} key={result.id} className={classes.resultItem}>
                    <Image src={avatarImage} alt="Avatar Image" width={24} height={24} />
                    <h2>{result.first_name} {result.last_name}</h2>
                </button>
            ))}
            {searchResults.next && <button className={classes.showAllBtn}>Show all results</button>}
        </div>
    );
};

const SearchBar: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<PaginatedSearchResults>({ res: [], next: null });
    const { search, updateSearch } = useUserContext();
    
    const getSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        updateSearch(searchValue);

        try {
            const res = await axios.get("http://localhost:8000/api/users/search/", {
                params: {
                    page: 1,
                    search: searchValue,
                },
            });
            setSearchResults({ next: res.data.next, res: res.data.results });
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleImageClick = () => {
        setSearchVisible(!searchVisible);
    };

    return (
        <div className={`${classes.container} ${searchVisible ? classes.active : ''}`}>
            <Image 
                onClick={handleImageClick} 
                className={classes.image} 
                src={searchLogoBlack} 
                alt="Search Logo"
                width={15} 
                height={15}
            />
            <input 
                className={classes.input} 
                placeholder="Search" 
                onChange={getSearch} 
                value={search}
            />
            {search && <SearchResultComponent searchResults={searchResults} />}
        </div>
    );
};

export default SearchBar;

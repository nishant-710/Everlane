import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useNavbarLogic = (API_URL) => {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchSearchResults = async () => {

        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/user/search?search=${searchQuery}`);
            const results = response.data.results || response.data || [];
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error.message);
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchSearchResults();
    };

    const handleSearchItemClick = (item) => {

        setSearchResults([]);
        setShowSearchBar(false);
        setSelectedItem(item);
        navigate(`/product/${item._id}`);
    };

    useEffect(() => {

        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(() => fetchSearchResults(), 400);
        
        return () => clearTimeout(timer);
    
    }, [searchQuery]);

    useEffect(() => {

        const handleClickOutside = (e) => {
    
            if (!e.target.closest('.search-dropdown')) {
                setSearchResults([]);
                setShowSearchBar(false);
            }
        };
    
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        showSearchBar,
        setShowSearchBar,
        handleSearchSubmit,
        handleSearchItemClick,
        editModalVisible,
        setEditModalVisible,
        selectedItem
    };
};

export default useNavbarLogic;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setModalOpen } from "../features/trending/authSlice";

const useNavbarData = (user, API_URL) => {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  useEffect(() => {
 
    const storedToken = localStorage.getItem("token");
 
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const openLoginModal = () => {
 
    dispatch(setModalOpen(true));
    navigate(`${location.pathname}?action=login`);
  };

  const closeLoginModal = () => {
 
    dispatch(setModalOpen(false));
    navigate(location.pathname);
  };

  const fetchSubcategories = async ({ mainId, filterId }) => {

    if (!user && !token) {
    
      openLoginModal();
      return;
    }

    try {
    
      const res = await axios.post(`${API_URL}/user/subCategories`, { mainId });
      setSubcategories(res.data?.subCategories || []);
      setActiveDropdownId(filterId);
    
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  return {
    token,
    subcategories,
    setSubcategories,
    activeDropdownId,
    setActiveDropdownId,
    fetchSubcategories,
    openLoginModal,
    closeLoginModal,
  };
};

export default useNavbarData;

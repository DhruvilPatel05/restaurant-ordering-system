import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext([]);

const API = import.meta.env.VITE_API_URL;
// const restaurantId = localStorage.getItem("restaurantId");
// inside StoreContext component

export const StoreContextProvider = (props) => {
  const [foodList, setfoodList] = useState([]);
  const [quantities, setquantities] = useState({});
  const [restaurantId, setRestaurantId] = useState(
  localStorage.getItem("restaurantId")
);
const [foodLoading, setFoodLoading] = useState(true);
  const [token, settoken] = useState(""); //in this relode site set token to " "

  const navigate = useNavigate();

  const increseQuantity = async (foodId) => {
    const token = localStorage.getItem("token");
    const tableNo =parseInt(localStorage.getItem("tableNo"));
    // 🔐 If user not logged in
    if (!token) {
      toast.warning("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    if (!tableNo) {
      toast.warning("Please enter table number.");
      return;
    }

    setquantities((prevQuantities) => ({
      ...prevQuantities,
      [foodId]: (prevQuantities[foodId] || 0) + 1,
    }));

    await axios.post(
  `${API}/api/cart`,
  {
    foodId,
    tableNo,
    restaurantId,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
  };

  const decreaseQuantity = async (foodId) => {
    setquantities((prevQuantities) => ({
      ...prevQuantities,
      [foodId]: prevQuantities[foodId] > 0 ? prevQuantities[foodId] - 1 : 0,
    }));

    await axios.post(
  `${API}/api/cart/remove`,
  {
    foodId,
    restaurantId,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
  };
  //   const removeItem = (foodId) => {
  //     setquantities((prevQuantities) => {
  //       const updatedQuantities = { ...prevQuantities };
  //       delete updatedQuantities[foodId];
  //       return updatedQuantities;
  //     });
  //   };
  const removeItem = async (foodId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
     
        `${API}/api/cart/remove/all`,
        { foodId ,restaurantId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setquantities(response.data.items);
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  const loadCart = async (token) => {
    const response = await axios.get(
  `${API}/api/cart/${restaurantId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
    setquantities(response.data.items);
  };

const fetchFoodLIst = async (token1) => {
  try {
    setFoodLoading(true);

    const currentRestaurantId = localStorage.getItem("restaurantId");

    if (!currentRestaurantId) {
      console.log("Restaurant ID not found");
      return;
    }

    const response = await axios.get(
      `${API}/api/foods/user/${currentRestaurantId}`,
      {
        headers: token1
          ? {
              Authorization: `Bearer ${token1}`,
            }
          : {},
      }
    );

    if (response.status === 200) {
      setfoodList(response.data);
    }
  } catch (error) {
    console.error("Error while fetching food list:", error);
  } finally {
    setFoodLoading(false);
  }
};

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRestaurantId = localStorage.getItem("restaurantId");

  if (!storedRestaurantId) {
    setFoodLoading(false);
    return;
  }

  if (storedToken) {
    settoken(storedToken);
    loadCart(storedToken);
    fetchFoodLIst(storedToken);
  } else {
    fetchFoodLIst();
  }
}, []);

  const contextVaule = {
    foodList,
    quantities,
    setquantities,
    increseQuantity,
    decreaseQuantity,
    removeItem,
    token,
    settoken,
    loadCart,
     fetchFoodLIst,
    foodLoading,
  };
  return (
    <StoreContext.Provider value={contextVaule}>
      {props.children}
    </StoreContext.Provider>
  );
};

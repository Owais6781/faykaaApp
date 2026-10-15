import { useNavigation } from "@react-navigation/native";
import { useAddToCartDbMutation } from "../CartApi";
import {useRequireLogin} from "./useRequireLogin";

export const useCart = () => {
  const navigation = useNavigation<any>();
  const { requireLogin } = useRequireLogin();

  const [addToCartDb, { isLoading }] = useAddToCartDbMutation();

  const handleAddToCart = async (
    item: any,
    cartItems: string[],
    setCartItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    try {
      // 🔐 Check login/token
      const isLoggedIn = await requireLogin();

      if (!isLoggedIn) {
        return;
      }

      // 🆔 Get product ID
      const productId = item?._id ?? item?.id;

      if (!productId) {
        console.log("Product ID not found");
        return;
      }

      const itemKey = String(productId);

      // 🛒 Already in cart → Cart page
      if (cartItems.includes(itemKey)) {
        navigation.navigate("Cart");
        return;
      }

      // ➕ Add product to cart
      await addToCartDb({
        productId: itemKey,
        quantity: 1,
      }).unwrap();

      // Update local cart state
      setCartItems((prev) => [...prev, itemKey]);

    } catch (error) {
      console.log("Failed to add cart:", error);
    }
  };

  return {
    handleAddToCart,
    isLoading,
  };
};

 

import {useRequireLogin} from "./useRequireLogin";
import { useToggleWishlistDBMutation } from "../WishlistApi";

export const useWishlist = () => {
  const { requireLogin } = useRequireLogin();

  const [toggleWishlistDB, { isLoading }] =
    useToggleWishlistDBMutation();

  const handleWishlist = async (item: any) => {
    try {
      // 🔐 Check token using reusable login logic
      const isLoggedIn = await requireLogin();

      if (!isLoggedIn) {
        return;
      }

      // Get product ID
      const productId = item?._id ?? item?.id;

      if (!productId) {
        console.log("Product ID not found");
        return;
      }

      // ❤️ Add / Remove wishlist
      await toggleWishlistDB({
        productId: String(productId),
      }).unwrap();

    } catch (error) {
      console.log("Wishlist update failed:", error);
    }
  };

  return {
    handleWishlist,
    isLoading,
  };
};

 
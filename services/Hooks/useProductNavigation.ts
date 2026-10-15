import { useNavigation } from "@react-navigation/native";

export const useProductNavigation = () => {
  const navigation = useNavigation<any>();

  const handleViewCard = (item: any) => {
    const productId = item?._id ?? item?.id;

    if (!productId) {
      console.log("Product ID not found");
      return;
    }

    navigation.navigate("ProductViewCard", {
      productId,
    });
  };

  return {
    handleViewCard,
  };
};

 
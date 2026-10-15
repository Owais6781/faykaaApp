import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useRequireLogin = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const requireLogin = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.navigate("LogInPage", {
          from: route.name,
        });

        return false;
      }

      return true;
    } catch (error) {
      console.log("Login check failed:", error);
      return false;
    }
  };

  return { requireLogin };
};

 
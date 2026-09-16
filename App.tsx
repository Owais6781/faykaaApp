
import { Provider } from "react-redux";
import { store } from "./App/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "./global.css";
// import {FontProvider} from "./Screen/FontProvider/FontProvider"

import Layout from "./components/Layout/Layout";

import Heroslider from "./Screen/Herosection/HeroSlider"
 import ShopCategory from "./Screen/Category/ShopCategory"
import OurCategory from "./Screen/Category/OurCategory"
import CategoryList from "./Screen/Category/CategoryList"
import ShopCatalog from "./Screen/Shop/Shop"
import ProductViewCard from "./components/ProductViewCard/ProductViewCard";
import Checkout from "./components/CheckoutPage/Checkout";
import BestSeller from "./Screen/Best-Seller/BestSeller";
import MegaDealsSlid from "./Screen/MegaDeals-Slid/MegaDealsSlid"
import MegaDeals from "./Screen/Mega-Deals/MegaDeals"
import NewArrivals from "./Screen/New-Arrivals/NewArrivals"


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store} >
      {/* <FontProvider> */}
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen name="Home">
          {() => (
            <Layout>
              <Heroslider />
              <ShopCategory />
              <OurCategory />
              <BestSeller/>
              <MegaDealsSlid/>
              <MegaDeals/>
              <NewArrivals/>
          
            </Layout>
          )}
        </Stack.Screen>
          <Stack.Screen name="CategoryList">
          {() => (
            <Layout>
              <CategoryList/>
            </Layout>
          )}
        </Stack.Screen>
         <Stack.Screen name="ProductViewCard">
          {() => (
            <Layout>
           <ProductViewCard/>
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Checkout">
          {() => (
            <Layout>
           <Checkout/>
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Shop">
          {() => (
            <Layout>
            <ShopCatalog /> 
            </Layout>
          )}
        </Stack.Screen>

           <Stack.Screen name="BestSeller">
          {() => (
            <Layout>
          <BestSeller/>
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Cart">
          {() => (
            <Layout>
              {/* <CartScreen /> */}
            </Layout>
          )}
        </Stack.Screen>

      </Stack.Navigator>

    </NavigationContainer>
    {/* </FontProvider> */}
    </Provider>
  );
}
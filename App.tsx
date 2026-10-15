
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./App/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { AppLoader } from "./components/Global Loader/Loader"
import { FontProvider } from "./components/FontProvider/FontProvider"
import { Layout } from "./components/Layout/Layout";

import { Heroslider } from "./Screen/Herosection/HeroSlider"
import { ShopCategory } from "./Screen/Category/ShopCategory"
import { OurCategory } from "./Screen/Category/OurCategory"
import { CategoryList } from "./Screen/Category/CategoryList"
import { ShopCatalog } from "./Screen/Shop/Shop"
import { ProductViewCard } from "./components/ProductViewCard/ProductViewCard";
import { Checkout } from "./components/CheckoutPage/Checkout";
import { PaymentGateway } from "./components/PaymentGateway/PaymentGateway";
import { BestSeller } from "./Screen/Best-Seller/BestSeller";
import { MegaDealsSlid } from "./Screen/MegaDeals-Slid/MegaDealsSlid"
import { MegaDeals } from "./Screen/Mega-Deals/MegaDeals"
import { NewArrivals } from "./Screen/New-Arrivals/NewArrivals"
import { ProfileScreen } from "./components/Account/ProfileScreen"
import { LoginPage } from "./components/Account/LoginPage/LoginPage"
import { NewRegistation } from "./components/Account/New Registation/Registation"
import { ProfileInfo } from "./components/Account/ProfileInfo/ProfileInfo"
import { OrderList } from "./components/Account/OrderList/OrderList"
import { Wishlist } from "./components/Wishlist/Wishlist"
import { Cart } from "./components/Cart/Cart"

// import { useGetProductCategoryQuery } from "./services/ProductApi"
// import { Test } from "./globaltheme/test"
const Stack = createNativeStackNavigator();

function MainNavigator() {

  // const { isLoading } = useGetProductCategoryQuery();
  // if (isLoading) {

  //  return <AppLoader visible={true} title="Loading ..." />;
     

  // }
  return (


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
              <BestSeller />
              <MegaDealsSlid />

              <NewArrivals />
              {/* <Test /> */}


            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="CategoryList">
          {() => (
            <Layout>
              <CategoryList />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ProductViewCard">
          {() => (
            <Layout>
              <ProductViewCard />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Checkout">
          {() => (
            <Layout>
              <Checkout />
            </Layout>
          )}
        </Stack.Screen>
            <Stack.Screen name="PaymentGateway">
          {() => (
            <Layout>
              <PaymentGateway />
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
              <BestSeller />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="MegaDeals">
          {() => (
            <Layout>
              <MegaDeals />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="NewArrivels">
          {() => (
            <Layout>
              <NewArrivals />
            </Layout>
          )}
        </Stack.Screen>


        <Stack.Screen name="Profile">
          {() => (
            <Layout>
              <ProfileScreen />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="LogInPage">
          {() => (
            <Layout>
              <LoginPage />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="NewRegistation">
          {() => (
            <Layout>
              <NewRegistation />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="ProfileInfo">
          {() => (
            <Layout>
              <ProfileInfo />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Orderslist">
          {() => (
            <Layout>
              <OrderList />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Wishlist">
          {() => (
            <Layout>
              <Wishlist />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Cart">
          {() => (
            <Layout>
              <Cart />
            </Layout>
          )}
        </Stack.Screen>

      </Stack.Navigator>

    </NavigationContainer>


  );
}


export default function App() {
  return (
    <Provider store={store} >
      <FontProvider>
        <MainNavigator />
      </FontProvider>

    </Provider>
  )
}







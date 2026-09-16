import { StyleSheet } from 'react-native';
import {palette} from "../../globaltheme/colors"


 export const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 20,
    //  backgroundColor: "#FFFFFF",
    
       backgroundColor: palette.Bgthem
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 4 / 5,
    backgroundColor: "#EFEAE0",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  disabledImage: {
    opacity: 0.5,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#7B2D26",
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  discountText: {
    color: "#F8F5EF",
    fontSize: 10,
    fontWeight: "600",
  },
  couponBanner: {
    position: "absolute",
    bottom: 42,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(245, 198, 216, 0.4)",
    zIndex: 20,
    gap: 4,
  },
  couponEmoji: {
    fontSize: 10,
  },
  couponDiscountText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#E84C7F",
  },
  couponCodeText: {
    fontSize: 9,
    color: "#1E1B16",
  },
  copyButton: {
    borderWidth: 1,
    borderColor: "#E84C7F",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  soldOutOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 27, 22, 0.9)",
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 10,
  },
  soldOutText: {
    color: "#F8F5EF",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  quickAddButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    zIndex: 10,
  },
  quickAddText: {
    color: "#1E1B16",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardContent: {
    paddingTop: 10,
      backgroundColor: "#F8F5EF",
    
    // backgroundColor: palette.Bgthem
  },
  itemCategory: {
    fontSize: 10,
    fontWeight: "600",
    color: "#A9803F",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    color: "#1E1B16",
  },
  itemDescription: {
    fontSize: 11,
    color: "#9A9282",
    marginTop: 2,
  },
  itemColor: {
    fontSize: 11,
    color: "#B3AB97",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  reviewsCount: {
    fontSize: 10,
    color: "#B3AB97",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
    gap: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E1B16",
  },
  originalPrice: {
    fontSize: 11,
    color: "#B3AB97",
    textDecorationLine: "line-through",
  },
});

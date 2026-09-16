import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const AVATAR_SIZE = 80;
export const ITEM_SPACING = 16;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F8F5EF",
    // paddingVertical: 16,
  },
  centerContainer: {
    width: "100%",
    paddingVertical: 40,
    backgroundColor: "#F8F5EF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    color: "#A9803F",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  mainHeader: {
    fontSize: 28,
    fontStyle: "italic",
    color: "#1E1B16",
  },
  itemContainer: {
    alignItems: "center",
    width: AVATAR_SIZE + 12,
  },
  imageWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2D9C4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    color: "#3A362F",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  errorIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8F5EF",
    borderWidth: 1,
    borderColor: "#E2D9C4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#1E1B16",
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#9A9282",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#1E1B16",
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryText: {
    color: "#F8F5EF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
});
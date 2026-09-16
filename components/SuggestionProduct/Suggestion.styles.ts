
import { StyleSheet,  } from "react-native";
export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
     paddingHorizontal: 10,
    backgroundColor: "#FBF7F0",
  },

  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2D9C4",
    paddingBottom: 16,
  },

  subheading: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    color: "#A9803F",
    textTransform: "uppercase",
    marginBottom: 6,
  },

  heading: {
    fontSize: 28,
    color: "#1E1B16",
    fontStyle: "italic",
    fontWeight: "normal",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
   width: "100%",
  justifyContent: "space-between",
  },

  
});
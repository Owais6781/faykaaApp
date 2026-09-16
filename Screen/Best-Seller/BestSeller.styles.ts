
import { StyleSheet,  } from 'react-native';
 export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#E2D9C4",
    paddingBottom: 16,
    marginBottom: 20,
  },
  curatedText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#A9803F",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bestSellerTitle: {
    fontSize: 28,
    fontStyle: "italic",
    color: "#1E1B16",
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#A9803F",
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 24,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8F5EF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#1E1B16",
    marginTop: 12,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: "#9A9282",
    marginTop: 4,
  },
  errorIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2D9C4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1E1B16",
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#F8F5EF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
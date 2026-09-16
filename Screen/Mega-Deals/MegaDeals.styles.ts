

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Left aur right side ki padding aur columns ke beech ka gap set kiya hai
const horizontalPadding = 12;
const columnGap = 12;

// Screen width me se padding aur gap minus karke exact 2 columns ki width calculate kar rahe hain
const cardWidth = (width - horizontalPadding * 2 - columnGap) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  contentContainer: {
    paddingHorizontal: horizontalPadding,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#E2D9C4",
    // Top/bottom margins aur padding ko reduce kar diya hai
    paddingBottom: 8,
    marginBottom: 10,
  },
  curatedText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#A9803F",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  MegaDealsTitle: {
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
    rowGap: 16, // Rows ke beech ka gap
  },
  gridItemWrapper: {
    width: cardWidth, // Exact 2 columns ke liye dynamic width
    marginBottom: 4,
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
  errorTitle: {
    fontSize: 20,
    color: "#1E1B16",
    fontStyle: "italic",
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#9A9282",
    textAlign: "center",
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
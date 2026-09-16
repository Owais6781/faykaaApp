import { StyleSheet,  } from 'react-native';











export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  productSection: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  productContentContainer: {
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F5EF",
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9CFB8",
    marginBottom: 12,
    paddingVertical: 6,
    color: "#1E1B16",
    fontSize: 13,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FAF7F2",
    borderWidth: 1,
    borderColor: "#E2D9C4",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCategoryChip: {
    backgroundColor: "#A9803F",
    borderColor: "#A9803F",
  },
  categoryChipText: {
    fontSize: 11,
    color: "#5A5245",
  },
  activeCategoryChipText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

import { StyleSheet ,  Dimensions,} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 24) / 2;
export const styles = StyleSheet.create({
  sectionContainer: {
    paddingTop: 2,
    backgroundColor: "#F8F5EF",
    paddingHorizontal: 6,
  },
  loadingContainer: {
    paddingVertical: 80,
    paddingHorizontal: 16,
    backgroundColor: "#F8F5EF",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerWrapper: {
    position: "relative",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerCircleOuter: {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2D9C4",
  },
  spinnerCircleInner: {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "transparent",
    borderTopColor: "#A9803F",
  },
  loadingTitle: {
    marginTop: 24,
    fontSize: 22,
    fontStyle: "italic",
    color: "#1E1B16",
  },
  loadingSubtitle: {
    fontSize: 13,
    color: "#9A9282",
    marginTop: 4,
  },
  headerBox: {
    backgroundColor: "#1E1B16",
    padding: 24,
    marginBottom: 24,

  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  flameIconBox: {
    display: "none", // hidden on small screens equivalent, shown on tablets if needed
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(217, 192, 143, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(217, 192, 143, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#D9C08F",
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 32,
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginTop: 6,
  },
  goldText: {
    color: "#D9C08F",
    fontWeight: "600",
  },
  sliderContainer: {
    backgroundColor: "#1E1B16",
    marginTop: -30,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 18,

  },
  scrollContent: {
    backgroundColor: "#1E1B16",
    gap: 16,
  },
  cardWrapper: {
    // width: 260, // Adjust width based on your MegaDealsCard layout requirements
   width: CARD_WIDTH,
  },
});
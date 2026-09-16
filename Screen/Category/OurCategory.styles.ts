
import { StyleSheet, Dimensions } from 'react-native';


export const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = SCREEN_WIDTH * 0.72;
export const CARD_HEIGHT = 320;
export const SPACING = 16;
export const SCREEN_WIDTH_VAL = SCREEN_WIDTH;
export const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#F8F5EF",
        paddingVertical: 16,
    },
    centerContainer: {
        width: "100%",
        paddingVertical: 40,
        backgroundColor: "#F8F5EF",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTextContainer: {
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
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 4,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E2D9C4",
        backgroundColor: "#1E1B16",
        position: "relative",
    },
    cardImage: {
        width: "100%",
        height: "100%",
    },
    cardContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    collectionTag: {
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 1.8,
        color: "#D9C08F",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 24,
        fontStyle: "italic",
        color: "#FFFFFF",
    },
    cardSubTitle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: 4,
    },
    exploreBtn: {
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.4)",
        paddingBottom: 4,
    },
    exploreText: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 1.4,
        color: "#FFFFFF",
        marginRight: 4,
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
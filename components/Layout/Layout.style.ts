
import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EF',
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Footer ki height ke barabar space taaki scrollable item na chhupe
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999, // Screen me sabse upar layer par lane ke liye
    elevation: 10, // Android ke liye shadow & depth z-index
  },
});
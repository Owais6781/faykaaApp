import { StyleSheet } from 'react-native';
import {palette} from "../../globaltheme/colors"
// Global Color Palette & Theme Constants


export const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: palette.Bgthem,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray200,
  },
  mainHeader: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12, // Left side padding kam kar di hai
    paddingRight: 20,
  },
  profileButton: {
    flexDirection: 'row', // Avatar aur Name side-by-side
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  pressedBackground: {
    backgroundColor: palette.hoverCream,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: palette.charcoal,
    marginRight: 10, // Image aur Text ke beech space
  },
  profileNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.charcoal,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
    wishlistBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: palette.white,
    fontSize: 10,
    fontWeight: '600',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray100,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: palette.charcoal,
  },

  searchActionGroup: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
actionIconButton: {
  padding: 4,
  justifyContent: 'center',
  alignItems: 'center',
},
});
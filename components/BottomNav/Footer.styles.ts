import { StyleSheet } from 'react-native';
import {palette} from "../../globaltheme/colors"


export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.Bgthem,
    borderTopWidth: 1,
    borderTopColor: palette.borderGold,
    paddingVertical: 10,
    paddingHorizontal: 12,


  },
  navRow: {
    flexDirection: 'row', // Horizontally align karne ke liye
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.gray,
    marginTop: 4,
  },
  // Active Tab Style Option (If needed)
  activeTabLabel: {
    color: palette.terracotta,
    fontWeight: '600',
  },
});
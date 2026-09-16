import { StyleSheet, Dimensions } from 'react-native';
import { palette } from '../../globaltheme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({

  section: {
    width: '100%',
    backgroundColor: '#F8F5EF',
    paddingHorizontal: 8,
    // paddingVertical: 6,
  },

  sliderContainer: {
    width: '100%',
    height: width * 0.55,
    maxHeight: 200,
    borderRadius: 12,
    overflow: 'hidden',
   
  },

  slide: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#171717',
    borderRadius: 12,
    overflow: 'hidden',

  },

  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  content: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 36,
  
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,192,143,0.5)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  typeText: {
    color: palette.goldAccent,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.4)',
    backgroundColor: 'rgba(80,0,0,0.5)',
  },

  dateText: {
    color: '#FECACA',
    fontSize: 9,
  },

  dateBold: {
    fontWeight: '700',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 32,
    marginBottom: 5,
  },

  subtitle: {
    color: '#F5E8C8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },

  couponWrapper: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },

  couponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,213,106,0.4)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  couponLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
  },

  couponCode: {
    color: '#FFD56A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  copyButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#FFD56A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
    maxWidth: '90%',
  },

  ctaButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
  },

  ctaText: {
    color: palette.charcoal,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  pagination: {
    bottom: 8,
  },

  loadingContainer: {
    minHeight: 250,
    backgroundColor: palette.Bgthem,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  discoverText: {
    color: palette.terracotta,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 4,
  },

  loadingTitle: {
    color: palette.charcoal,
    fontSize: 24,
    fontStyle: 'italic',
    marginBottom: 20,
  },

  loader: {
    marginTop: 5,
  },

  errorContainer: {
    minHeight: 300,
    backgroundColor: palette.Bgthem,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  errorTitle: {
    color: palette.charcoal,
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },

  errorDescription: {
    color: '#9A9282',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor: palette.charcoal,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 5,
  },

  retryText: {
    color: palette.Bgthem,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
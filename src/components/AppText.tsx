import { Text as RNText, TextProps, StyleSheet } from 'react-native';

import { FONTS } from '@/styles/theme';

function familyForWeight(weight?: string | number): string {
  const w = String(weight ?? '400');
  if (w === '800' || w === '900') return FONTS.extrabold;
  if (w === '700' || w === 'bold') return FONTS.bold;
  if (w === '600') return FONTS.semibold;
  if (w === '500') return FONTS.medium;
  return FONTS.regular;
}

export default function AppText({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) || {};
  const fontFamily = familyForWeight(flat.fontWeight as string | number | undefined);
  return <RNText {...rest} style={[style, { fontFamily }]} />;
}

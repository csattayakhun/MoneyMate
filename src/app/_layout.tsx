import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { configureFonts, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_600SemiBold,
  Prompt_700Bold,
  Prompt_800ExtraBold,
} from '@expo-google-fonts/prompt';

import { MoneyProvider } from '@/context/MoneyContext';
import { COLORS, FONTS } from '@/styles/theme';

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: COLORS.primaryLight,
    onPrimaryContainer: COLORS.primaryDark,
    secondaryContainer: COLORS.primaryLight,
    onSecondaryContainer: COLORS.primaryDark,
    background: COLORS.bg,
    surface: COLORS.surface,
    outline: COLORS.border,
  },
  fonts: configureFonts({ config: { fontFamily: FONTS.medium } }),
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
    Prompt_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider
          theme={paperTheme}
          settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}>
          <MoneyProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="add" options={{ presentation: 'modal' }} />
            </Stack>
          </MoneyProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

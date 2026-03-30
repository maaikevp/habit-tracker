import { AuthProvider, useAuth } from "@/context/AuthContext";
import { animePalette, animePaperTheme } from "@/theme/animeTheme";
import { Stack, useRouter, useSegments } from "expo-router";
import { ReactNode, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments() as string[];

  const inAuthGroup = segments[0] === "(auth)";
  const inTabsGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (isLoadingUser) return;
    if (!user) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [inAuthGroup, inTabsGroup, isLoadingUser, router, segments, user]);

  if (isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={animePalette.sakuraDeep} />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={animePaperTheme}>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// import { Slot, usePathname, useRouter } from "expo-router";
// import { useEffect } from "react";
// import { AuthProvider, useAuth } from "../../provider/AuthProvider";

// // Makes sure the user is authenticated before accessing protected pages
// const InitialLayout = () => {
//   const { session, initialized } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     if (!initialized) return;

//     // Check if the path/url is in the (auth) group
//     const inAuthGroup = pathname.startsWith("/auth");

//     if (session && !inAuthGroup) {
//       // Redirect authenticated users to the list page
//       router.replace("/");
//     } else if (!session) {
//       // Redirect unauthenticated users to the login page
//       router.replace("/");
//     }
//   }, [session, initialized]);

//   return <Slot />;
// };

// // Wrap the app with the AuthProvider
// const RootLayout = () => {
//   return (
//     <AuthProvider>
//       <InitialLayout />
//     </AuthProvider>
//   );
// };

// export default RootLayout;

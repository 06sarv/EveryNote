import "@bacons/text-decoder/install";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import AuthScreen from "./auth";
import HomeScreen from "./index";
import { useAuthStore } from "../utils/auth-store";

const Stack = createNativeStackNavigator();

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { user, loading, error, checkSession } = useAuthStore();

  // On app mount, check if user is logged in
  useEffect(() => {
    checkSession();
  }, []);

  // Show loading spinner while checking session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Show error state if there is an authentication error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF" }}>
        <StatusBar />
        <Text style={{ color: "#fff", fontSize: 16, marginBottom: 16 }}>Error: {error}</Text>
        <Pressable onPress={checkSession} style={{ backgroundColor: "#fff", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
          <Text style={{ color: "#111", fontWeight: "bold" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          },
        }}
      >
        {/* If user is logged in, show Home, else show Auth */}
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}

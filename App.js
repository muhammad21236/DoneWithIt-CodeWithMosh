import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./app/navigation/rootNavigation";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Function to setup notification channel
async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }
}

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupNotificationChannel(); // Call inside useEffect
  }, []); // Runs once when the app starts

  const restoreToken = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreToken}
        onFinish={() => setIsReady(true)}
        onError={(err) => console.log(err)}
      />
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}

import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { Redirect } from "expo-router";
import { MovieProvider } from "@/context/MovieContext"; // Import MovieProvider

export default function RootLayout() {
  return (
    <MovieProvider>
      <>
        <Redirect href="/Landing/Landing" />
        <StatusBar hidden={true} />

        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Landing/Landing"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login/login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login/signin"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Edit/edit"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login/resetpassword"
            options={{
              headerShown: false,
            }}
          />
          {/* Thêm save.tsx nếu chưa có */}
          <Stack.Screen
            name="save"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </>
    </MovieProvider>
  );
}
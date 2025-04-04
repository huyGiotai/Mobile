import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { Redirect, useRouter } from "expo-router";


export default function RootLayout() {
  return (
    
    <>
    <Redirect href={'/Landing/Landing'}/>
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
        
      </Stack>
    </>
  );
}

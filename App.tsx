import React from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

import { StackRoutes } from "./src/routes/stackRoutes";

import {
  NativeBaseProvider,
  extendTheme,
} from "native-base";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Favorites from "./src/pages/Favorites";
import Register from "./src/pages/RegisterFood";

library.add(fas);

// Define the config
const config = {
  useSystemColorMode: true,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={StackRoutes} initialParams={{fetch: true}}/>
          <Tab.Screen name="Register" component={Register}/>
          <Tab.Screen name="Favorites" component={Favorites} initialParams={{fetch: true}}/>
        </Tab.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

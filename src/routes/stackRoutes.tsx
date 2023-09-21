import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../pages/Home";
import FoodDetails from "../pages/FoodDetails";

const Stack = createNativeStackNavigator();

export function StackRoutes({route}) {
    const fetch = route.params.fetch;
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ fetch }}/>
            {/* @ts-ignore */}
            <Stack.Screen name="FoodDetails" component={FoodDetails} initialParams={{ fetch }}/>
        </Stack.Navigator>
    )
}
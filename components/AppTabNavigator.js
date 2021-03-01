import * as React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { AppStackNavigator } from "./AppStackNavigator";
import Exchange from "../screens/Exchange";

export const AppTabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/donate.png")}
          style={{ width: 20, height: 30 }}
        />
      ),
      tabBarLabel: "HomeScreen",
    },
  },
  BookRequest: {
    screen: Exchange,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/request.png")}
          style={{ width: 30, height: 25 }}
        />
      ),
      tabBarLabel: "Exchange",
    },
  },
});

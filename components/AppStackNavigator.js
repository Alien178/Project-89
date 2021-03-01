import * as React from "react";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import ReceiverDetailsScreen from "../screens/ReceiverDetailsScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyReceivedBartersScreen from "../screens/MyReceivedBartersScreen";

export const AppStackNavigator = createStackNavigator(
  {
    BarterList: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    ReceiverDetails: {
      screen: ReceiverDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ReceivedBarters: {
      screen: MyReceivedBartersScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  },

  {
    initialRouteName: "BarterList",
  }
);

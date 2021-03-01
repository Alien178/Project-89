import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { ListItem, Icon } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";

export default class SwipeableFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotification: this.props.allNotification,
    };
  }

  updateMarkAsRead = (notification) => {
    db.collection("allNotifications").doc(notification.docID).update({
      notificationStatus: "read",
    });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotification = this.state.allNotification;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotification];
      this.updateMarkAsRead(allNotification[key]);
      newData.splice(key, 1);
      this.setState({
        allNotification: newData,
      });
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = (data) => (
    <Animated.View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{data.item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{data.item.message}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#29B6F6",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
      }}
    >
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          top: 0,
          bottom: 0,
          justifyContent: "center",
          width: 100,
          backgroundColor: "#29B6F6",
          right: 0,
        }}
      >
        <Text
          style={{
            color: "#ffff",
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
            alignSelf: "flex-start",
          }}
        >
          Mark As Read
        </Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotification}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey = {"0"}
          previewOpenValue = {-40}
          previewOpenDelay = {3000}
          onSwipeValueChange = {this.onSwipeValueChange}
          keyExtractor = {this.keyExtractor}
        />
      </View>
    );
  }
}

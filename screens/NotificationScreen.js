import * as React from "react";
import MyHeader from "../components/MyHeader";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { ListItem } from "react-native-elements";
import SwipeableFlatList from "../components/SwipeableFlatList";
import db from "../config";
import firebase from "firebase";

export default class NotificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      userID: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }

  getAllNotifications = () => {
    this.requestRef = db
      .collection("allNotifications")
      .where("notificationStatus", "==", "unread")
      .where("targetedUserID", "==", this.state.userID)
      .onSnapshot((Snapshot) => {
        var allNotifications = [];
        Snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["docID"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getAllNotifications();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader
          title={"My Notifications"}
          navigation={this.props.navigation}
        />
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length == 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Notifications</Text>
            </View>
          ) : (
            <SwipeableFlatList allNotification={this.state.allNotifications} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});

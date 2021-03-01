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
import db from "../config";
import firebase from "firebase";
import { Icon } from "react-native-elements";

export default class MyBartersScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      allBarters: [],
      userID: firebase.auth().currentUser.email,
      donorName: "",
    };
    this.requestRef = null;
  }

  getAllBarters = () => {
    this.requestRef = db
      .collection("allBarters")
      .where("donorID", "==", this.state.userID)
      .onSnapshot((Snapshot) => {
        var allBarters = [];
        Snapshot.docs.map((doc) => {
          var barters = doc.data();
          barters["docID"] = doc.id;
          allBarters.push(barters);
        });
        this.setState({
          allBarters: allBarters,
        });
      });
  };

  sendItem = (itemDetails) => {
    if (itemDetails.requestStatus == "Item Sent") {
      var requestStatus = "Donor Interested";
      db.collection("allBarters").doc(itemDetails.docID).update({
        requestStatus: "Donor Interested",
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requestStatus = "Item Sent";
      db.collection("allBarters").doc(itemDetails.docID).update({
        requestStatus: "Item Sent",
      });

      this.sendNotification(itemDetails, requestStatus);
    }
  };

  sendNotification = (itemDetails, requestStatus) => {
    var exchangeID = itemDetails.exchangeID;
    var donorID = itemDetails.donorID;
    db.collection("allNotifications")
      .where("exchangeID", "==", exchangeID)
      .where("donorID", "==", donorID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus == "Item Sent") {
            message = this.state.donorName + " "+ "has sent you the item.";
          } else {
            message =
              this.state.donorName + " " + "has shown interest donating the item.";
          }
          db.collection("allNotifications").doc(doc.id).update({
            message: message,
            notificationStatus: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  getUserDetails = (userID) => {
    db.collection("users")
      .where("username", "==", userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().firstName + " " + doc.data().lastName,
          });
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>
            {"Requested By: " +
              item.requestedBy +
              "\nStatus: " +
              item.requestStatus}
          </ListItem.Subtitle>
          <TouchableOpacity style={styles.button}>
            <Text
              style={{ color: "#FFFFFF" }}
              onPress={() => {
                this.sendItem(item);
              }}
            >
              Send Item
            </Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  componentDidMount() {
    this.getAllBarters();
    this.getUserDetails(this.state.userID);
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Barters" />
        <View style={{ flex: 1 }}>
          {this.state.allBarters.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all Barters</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allBarters}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

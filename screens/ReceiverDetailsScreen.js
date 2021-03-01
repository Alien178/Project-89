import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config.js";

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      userName: "",
      receiverID: this.props.navigation.getParam("details")["username"],
      exchangeID: this.props.navigation.getParam("details")["exchangeID"],
      itemName: this.props.navigation.getParam("details")["itemName"],
      description: this.props.navigation.getParam("details")["description"],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverRequestDocID: "",
    };
  }

  getUserDetails = (userID) => {
    db.collection("users")
      .where("emailID", "==", userID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data().firstName);
          this.setState({
            userName: doc.data().firstName + " " + doc.data().lastName,
          });
        });
      });
  };

  getreceiverDetails() {
    console.log("receiver ", this.state.receiverID);
    db.collection("users")
      .where("username", "==", this.state.receiverID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().firstName,
            receiverContact: doc.data().mobileNumber,
            receiverAddress: doc.data().address,
          });
        });
      });

    db.collection("exchange_requests")
      .where("exchangeID", "==", this.state.exchangeID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ receiverRequestDocID: doc.id });
        });
      });
  }

  updateBarterStatus = () => {
    db.collection("allBarters").add({
      itemName: this.state.itemName,
      exchangeID: this.state.exchangeID,
      requestedBy: this.state.receiverName,
      donorID: this.state.userID,
      requestStatus: "Donor Interested",
    });
  };

  addNotification = () => {
    console.log("in the function ", this.state.rec);
    var message =
      this.state.userName + " has shown interest in exchanging the item";
    db.collection("allNotifications").add({
      targetedUserID: this.state.receiverID,
      donorID: this.state.userID,
      exchangeID: this.state.exchangeID,
      itemName: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notificationStatus: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getreceiverDetails();
    this.getUserDetails(this.state.userID);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ffff"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Exchange Items",
              style: { color: "#ffff", fontSize: 20, fontWeight: "bold" },
            }}
            backgroundColor="#32867d"
          />
        </View>
        <View style={{ flex: 0.3, marginTop: RFValue(20) }}>
          <Card title={"Item Information"} titleStyle={{ fontSize: 20 }}>
            <Text style={{ fontWeight: "bold" }}>
              Name : {this.state.itemName}
            </Text>

            <Text style={{ fontWeight: "bold" }}>
              Reason : {this.state.description}
            </Text>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Receiver Information"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>

              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>

              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverID !== this.state.userID ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateBarterStatus();
                this.addNotification();
                this.props.navigation.navigate("MyBarters");
              }}
            >
              <Text style={{ color: "#ffff" }}>I want to Exchange</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(30),
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});

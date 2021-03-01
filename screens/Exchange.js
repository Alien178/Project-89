import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class Exchange extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: firebase.auth().currentUser.email,
      itemName: "",
      description: "",
      requestedItemName: "",
      exchangeID: "",
      itemStatus: "",
      docID: "",
      itemValue: "",
      currencyCode: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addItem = async (itemName, description) => {
    var userName = this.state.userName;
    var exchangeID = this.createUniqueId();
    db.collection("exchange_requests").add({
      username: userName,
      itemName: itemName,
      description: description,
      exchangeID: exchangeID,
      itemStatus: "requested",
      itemValue: this.state.itemValue,
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getExchangeRequest();
    db.collection("users")
      .where("username", "==", userName)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isExchangeRequestActive: true,
          });
        });
      });

    this.setState({
      itemName: "",
      description: "",
      itemValue: "",
    });
    return Alert.alert("Item ready to exchange", "", [
      {
        text: "OK",
        onPress: () => {
          this.props.navigation.navigate("HomeScreen");
        },
      },
    ]);
  };

  getIsExchangeRequestActive() {
    db.collection("users")
      .where("username", "==", this.state.userName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            isExchangeRequestActive: doc.data().isExchangeRequestActive,
            userdocID: doc.id,
            currencyCode: doc.data().currencyCode,
          });
        });
      });
  }

  getExchangeRequest = () => {
    // getting the requested item
    var exchangeRequest = db
      .collection("exchange_requests")
      .where("username", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().itemStatus !== "received") {
            this.setState({
              exchangeID: doc.data().exchangeID,
              requestedItemName: doc.data().itemName,
              itemStatus: doc.data().itemStatus,
              itemValue: doc.data().itemValue,
              docID: doc.id,
            });
          }
        });
      });
  };

  getData() {
    fetch(
      "http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1"
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currencyCode;
        var currency = responseData.rates.INR;
        var value = 69 / currency;
        console.log(value);
      });
  }

  componentDidMount() {
    this.getExchangeRequest();
    this.getIsExchangeRequestActive();
    this.getData();
  }

  receivedItem = (itemName) => {
    var userID = this.state.userName;
    var exchangeID = this.state.exchangeID;
    db.collection("received_items").add({
      userID: userID,
      itemName: itemName,
      exchangeID: exchangeID,
      itemStatus: "received",
    });
  };

  updateExchangeRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection("exchange_requests").doc(this.state.docID).update({
      itemStatus: "recieved",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("username", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            isExchangeRequestActive: false,
          });
        });
      });
  };
  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("username", "==", this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().firstName;
          var lastName = doc.data().lastName;

          // to get the donor id and item name
          db.collection("allNotifications")
            .where("exchangeID", "==", this.state.exchangeID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorID = doc.data().donorID;
                var bookName = doc.data().itemName;

                //targert user id is the donor id to send notification to the user
                db.collection("allNotifications").add({
                  targetedUserID: donorID,
                  message:
                    name + " " + lastName + " received the item " + itemName,
                  notificationStatus: "unread",
                  itemName: itemName,
                });
              });
            });
        });
      });
  };

  render() {
    if (this.state.isExchangeRequestActive === true) {
      // status screen
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Item Value </Text>

            <Text>{this.state.itemValue}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Item Status </Text>

            <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateExchangeRequestStatus();
              this.receivedItem(this.state.requestedItemName);
            }}
          >
            <Text>I recieved the Item </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Add Item" navigation={this.props.navigation} />
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              style={styles.formTextInput}
              placeholder={"Item Name"}
              maxLength={8}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
            />
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.formTextInput, { height: 150, textAlignVertical: 'top' }]}
              placeholder={"Description"}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                });
              }}
              value={this.state.description}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={"Item Value"}
              maxLength={8}
              keyboardType ={"numeric"}
              onChangeText={(text) => {
                this.setState({
                  itemValue: text,
                });
              }}
              value={this.state.itemValue}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => {
                this.addItem(this.state.itemName, this.state.description);
              }}
            >
              <Text
                style={{ color: "#ffff", fontSize: 18, fontWeight: "bold" }}
              >
                Add Item
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});

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

export default class MyReceivedBartersScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      receivedBartersList: [],
      userID: firebase.auth().currentUser.email
    };
    this.requestRef = null;
  }

  getReceivedBartersList = () => {
    this.requestRef = db.collection("received_items").where("userID", "==", this.state.userID).onSnapshot((Snapshot) => {
      var receivedBartersList = Snapshot.docs.map((document) => document.data());
      this.setState({
        receivedBartersList: receivedBartersList,
      });
    });
  };

  componentDidMount() {
    this.getReceivedBartersList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    console.log(item)
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.itemStatus}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title={"Received Barters"} navigation={this.props.navigation}/>
        <View style={{ flex: 1 }}>
          {this.state.receivedBartersList.length == 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Received Barters</Text>
            </View>
          ) : (
            <FlatList
              data={this.state.receivedBartersList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            ></FlatList>
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

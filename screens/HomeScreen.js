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

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allRequests: [],
    };
    this.requestRef = null;
  }

  getAllRequests = () => {
    this.requestRef = db
      .collection("exchange_requests")
      .onSnapshot((snapshot) => {
        var allRequests = snapshot.docs.map((document) => document.data());
        this.setState({ allRequests: allRequests });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    console.log(item);
    return (
      <ListItem
        key={index}
        bottomDivider
      >
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("ReceiverDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#FFFFFF" }}>View</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  componentDidMount() {
    this.getAllRequests();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Barter App" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allRequests.length === 0 ? (
            <View
              style={{
                flex: 1,
                fontSize: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>List of all Barter</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allRequests}
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
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});

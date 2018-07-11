import React from "react";
import { AppRegistry, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "https://api.graph.cool/simple/v1/cjj6ovxr53qo80110kxdhyiep"
});

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 10,
    marginRight: 10
  },
});

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  state = {
    login: "",
    password: ""
  };

  handleSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  handleLogin = () => {
    client
      .mutate({
        variables: {
          email: {
            email: this.state.login,
            password: this.state.password
          }
        },
        mutation: gql`
          mutation signIn(
            $email: AUTH_PROVIDER_EMAIL = { email: "", password: "" }
          ) {
            signinUser(email: $email) {
              token
              user {
                id
              }
            }
          }
        `
      })
      .then(response => {
        this.props.navigation.navigate("Home", {
          id: response.data.signinUser.user.id
        });
      })
      .catch(error => alert(error));
  };

  render() {
    return (
      <View>
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          label="Login"
          value={this.state.login}
          onChangeText={text => this.setState({ login: text })}
        />
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          label="Password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <Button
          raised
          disabled={this.state.login === "" || this.state.password === ""}
          onPress={this.handleLogin}
        >
          Login
        </Button>
        <Button raised onPress={this.handleSignUp}>
          Sign Up
        </Button>
      </View>
    );
  }
}

export default LoginScreen;

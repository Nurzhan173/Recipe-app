import React from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_USER = gql`
  mutation addUser(
    $authProvider: AuthProviderSignupData = {
      email: { email: "", password: "" }
    }
  ) {
    createUser(authProvider: $authProvider) {
      email
      password
    }
  }
`;

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: "Sign Up"
  };

  state = {
    login: "",
    password: ""
  };

  handleSignUp = () => {
    if (
      this.state.login !== "" &&
      this.state.password !== "" &&
      this.state.confPass !== ""
    ) {
      if (this.state.password !== this.state.confPass) {
        alert("Passwords are not same");
      } else {
      }
    }
  };

  render() {
    return (
      <Mutation mutation={CREATE_USER}>
        {(createUser, { data, loading, error }) => (
          <View>
            <TextInput
              autoCapitalize="none"
              style={{ marginLeft: 10, marginRight: 10 }}
              label="Login"
              value={this.state.login}
              onChangeText={text => this.setState({ login: text })}
            />
            <TextInput
              autoCapitalize="none"
              style={{ marginLeft: 10, marginRight: 10 }}
              label="Password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button
              raised
              disabled={this.state.login === "" || this.state.password === ""}
              onPress={() => {
                createUser({
                  variables: {
                    authProvider: {
                      email: {
                      email: this.state.login,
                      password: this.state.password
                      }
                    }
                  }
                })
                  .then(() => {
                    alert("User was succesfully created");
                    this.props.navigation.goBack();
                  })
                  .catch(error => {
                    alert(error.message);
                  });
              }}
            >
              Sign Up
            </Button>
          </View>
        )}
      </Mutation>
    );
  }
}

export default SignUpScreen;

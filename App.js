import { Constants } from "expo";
import { AppRegistry, StyleSheet, Text, ScrollView } from "react-native";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import React from "react";
import { Provider as PaperProvider, Button } from "react-native-paper";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";

import { RecipeList } from "./components/recipeList";
import { RecipeDetailsScreen } from "./components/detailsScreen";
import { AddRecipeScreen } from "./components/addScreen";
import { LoginScreen, SignUpScreen } from "./components/signupScreen";
import { ProfileScreen } from "./components/profileScreen";

const client = new ApolloClient({
  uri: "https://api.graph.cool/simple/v1/cjj6ovxr53qo80110kxdhyiep"
});

const styles = StyleSheet.create({
  container: {
    marginTop: 5
  }
});

export class HomePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "CookBook",
      headerRight: (
        <Button
          raised
          onPress={() =>
            navigation.navigate("Profile", { id: navigation.getParam("id") })
          }
          color="tomato"
        >
          Favorites
        </Button>
      )
    };
  };

  state = {
    id: ""
  };

  componentDidMount() {
    const id = this.props.navigation.getParam("id");
    this.setState({ id });
  }

  render() {
    return (
        <RecipeList style={styles.container} navigation={this.props.navigation} id={this.state.id} />
    );
  }
}


const AppStack = createStackNavigator({
  Home: HomePage,
  Details: RecipeDetailsScreen,
  AddReceipt: AddRecipeScreen,
  Profile: ProfileScreen
});
const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen
});

const RootStack = createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "Auth"
  }
);

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <PaperProvider>
          <RootStack />
        </PaperProvider>
      </ApolloProvider>
    );
  }
}

export default App;

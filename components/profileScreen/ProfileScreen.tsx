import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import React from "react";
import {
  Card,
  CardContent,
  CardCover,
  Title,
  Paragraph,
} from "react-native-paper";

const GET_FAVORITES = gql`
  query getUser($id: ID = "") {
    User(id: $id) {
      favRecipes {
        title
        description
        ingredients
        instructions
        file {
          url
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    width: 200
  }
});

class ProfileScreen extends React.Component {
  private keyExtractor = item => item.id;

  static navigationOptions = {
    title: "Favorite recipes"
  };

  state = {
    id: ""
  };

  componentDidMount() {
    const id = this.props.navigation.getParam("id");
    this.setState({ id });
  }

  private handleOnPressRecipe = recipe => {
    this.props.navigation.navigate("Details", {
      recipe: recipe,
      userId: this.state.id,
      fav: false
    });
  };

  private renderItem = ({ item: recipe }) => {
    return (
      <Card onPress={() => this.handleOnPressRecipe(recipe)}>
        <CardCover style={styles.image} source={{ uri: recipe.file.url }} />
        <CardContent>
          <Title>{recipe.title}</Title>
          <Paragraph>{recipe.description}</Paragraph>
        </CardContent>
      </Card>
    );
  };

  public render() {
    return (
      <Query query={GET_FAVORITES} variables={{ id: this.state.id }}>
        {({ loading, data, error }) =>
          loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={data ? data.User.favRecipes : []}
              renderItem={this.renderItem}
            />
          )
        }
      </Query>
    );
  }
}

export default ProfileScreen;

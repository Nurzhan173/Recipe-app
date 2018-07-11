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
  Button
} from "react-native-paper";

const GET_ALL_RECIPES = gql`
  {
    allRecipes {
      id
      title
      description
      instructions
      ingredients
      file {
        url
      }
    }
  }
`;

const styles = StyleSheet.create({
  button: {
    width: 300,
    alignSelf: "center"
  },
  image: {
    alignSelf: "center",
    width: 200,
    marginTop: 5
  },
  title: {
    fontSize: 20,
    alignSelf: "center"
  }
});

class RecipeList extends React.Component {
  private keyExtractor = item => item.id;

  public state = {
    refreshing: false
  };

  private handleOnPressRecipe = recipe => {
    this.props.navigation.navigate("Details", {
      recipe,
      userId: this.props.id,
      fav: true
    });
  };

  private renderItem = ({ item: recipe }) => (
    <Card onPress={() => this.handleOnPressRecipe(recipe)}>
      <CardCover style={styles.image} source={{ uri: recipe.file.url }} />
      <CardContent>
        <Title style={styles.title}>{recipe.title}</Title>
        <Paragraph>{recipe.description}</Paragraph>
      </CardContent>
    </Card>
  );

  public render() {
    return (
      <Query query={GET_ALL_RECIPES}>
        {({ loading, data, error, refetch }) =>
          loading ? (
            <ActivityIndicator />
          ) : (
            <React.Fragment>
              <FlatList
                style={this.props.style}
                keyExtractor={this.keyExtractor}
                data={data ? data.allRecipes : []}
                renderItem={this.renderItem}
                refreshing={this.state.refreshing}
                onRefresh={() => refetch()}
              />
              <Button
                style={styles.button}
                raised
                onPress={() =>
                  this.props.navigation.navigate("AddReceipt", {
                    refetch
                  })
                }
              >
                Add new recipe
              </Button>
            </React.Fragment>
          )
        }
      </Query>
    );
  }
}

export default RecipeList;

import React from "react";
import {Image, ScrollView, Share, StyleSheet, Text } from "react-native";
import { Caption, Headline, Button } from "react-native-paper";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TO_FAV = gql`
  mutation addRecipeToUser($favRecipesRecipeId: ID = "", $userUserId: ID = "") {
    addToUserOnRecipe(
      favRecipesRecipeId: $favRecipesRecipeId
      userUserId: $userUserId
    ) {
      userUser {
        id
      }
    }
  }
`;


const styles = StyleSheet.create({
  header: {
    alignSelf: "center",
    fontWeight: "bold"
  },
  helper: {
    fontSize: 13,
    marginLeft: 10
  },
  text: {
    fontSize: 16,
    marginLeft: 20
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 7
  }
});

class RecipeDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.recipe.title
    };
  };

  state = {
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    recipeId: "",
    userId: "",
    addToFav: false,
    imageUri: ""
  };

  public componentDidMount() {
    const params = this.props.navigation.state.params;
    this.updatePage(params);
  }

  updatePage = (params) => {
    this.setState({
      title: params.recipe.title,
      description: params.recipe.description,
      ingredients: params.recipe.ingredients,
      instructions: params.recipe.instructions,
      recipeId: params.recipe.id,
      userId: params.userId,
      addToFav: params.fav,
      imageUri: params.recipe.file.url
    });
  };

  render() {
    return (
      <Mutation mutation={ADD_TO_FAV}>
        {(addToUserOnRecipe, { data, loading, error }) => (
          <ScrollView>
            <Headline style={styles.header}>{this.state.title}</Headline>
            <Image style={styles.image} source={{uri: this.state.imageUri}}/>
            <Caption style={styles.helper}>Description:</Caption>
            <Text style={styles.text}>{this.state.description}</Text>
            <Caption style={styles.helper}>Ingredients:</Caption>
            {this.state.ingredients.map((item, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {item}
              </Text>
            ))}
            <Caption style={styles.helper}>Instructions:</Caption>
            {this.state.instructions.map((item, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {item}
              </Text>
            ))}
            {this.state.addToFav && (
              <Button
                raised
                onPress={() =>
                  addToUserOnRecipe({
                    variables: {
                      favRecipesRecipeId: this.state.recipeId,
                      userUserId: this.state.userId
                    }
                  })
                    .then(() => {
                      alert(this.state.title + " was added to favorites");
                      this.setState({
                        addedToFav: true
                      });
                    })
                    .catch(error => alert(error))
                }
              >
                Add to favorites
              </Button>
            )}
            <Button
              raised
              onPress={() =>
                Share.share({
                  message:
                    "Hey, look at this recipe! here is the description: " +
                    this.state.description,
                  title: this.state.title
                })
              }
            >
              Share
            </Button>
          </ScrollView>
        )}
      </Mutation>
    );
  }
}

export default RecipeDetailsScreen;

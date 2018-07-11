import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Mutation } from "react-apollo";
import { TextInput, Caption, Button } from "react-native-paper";
import gql from "graphql-tag";
import React from "react";
import _ from "lodash";
import ApolloClient from "apollo-boost";

import UploadImage from "./UploadImage";

const client = new ApolloClient({
  uri: "https://api.graph.cool/simple/v1/cjj6ovxr53qo80110kxdhyiep"
});
const FILE_UPLOAD_URL =
  "https://api.graph.cool/file/v1/cjj6ovxr53qo80110kxdhyiep";

const DEFAULT_IMAGE =
  "https://files.graph.cool/cjj6ovxr53qo80110kxdhyiep/cjjc0d7bzdcey0161mpc1p1uv";
const DEFAULT_IMAGE_ID = "cjjc0d7dddcez0161dii0boqx";
interface CreateRecipeFormProps {}
interface CreateRecipeFormState {
  titleInputValue: string;
}

const styles = StyleSheet.create({
  fields: {
    backgroundColor: "white",
    marginTop: 7,
    marginLeft: 10,
    marginRight: 10
  },
  caption: {
    marginLeft: 7,
    marginRight: 7
  }
});

class CreateRecipeForm extends React.Component<
  CreateRecipeFormProps,
  CreateRecipeFormState
> {
  state = {
    title: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    imageUri: "",
    imageId: ""
  };

  static navigationOptions = {
    title: "Add recipe"
  };

  handleAddIngredients = () => {
    if (_.last(this.state.ingredients) !== "") {
      this.setState(prevState => ({
        ingredients: _.concat(prevState.ingredients, "")
      }));
    }
  };

  handleAddInstructions = () => {
    if (_.last(this.state.instructions) !== "") {
      this.setState(prevState => ({
        instructions: _.concat(prevState.instructions, "")
      }));
    }
  };

  handleImageUpload = imageUri => {
    this.setState({
      imageUri
    });
  };

  handleUploadRecipe = async () => {
    let formData = new FormData();
    formData.append("data", {
      uri: this.state.imageUri === "" ? DEFAULT_IMAGE : this.state.imageUri,
      name: "image.png",
      type: "multipart/form-data"
    });

    try {
      const res = await fetch(FILE_UPLOAD_URL, {
        method: "POST",
        body: formData
      });
      const resJson = await res.json();
      client
        .query({
          variables: {
            url: resJson.url
          },
          query: gql`
            query getFile($url: String!) {
              File(url: $url) {
                id
              }
            }
          `
        })
        .then(response => {
          this.setState({
            imageId: response.data.File.id
          });
        });
    } catch (e) {
      console.log(e);
    } finally {
      await this.recipeMutation();
    }
  };

  recipeMutation = () => {
    client
      .mutate({
        variables: {
          title: this.state.title,
          description: this.state.description,
          ingredients: this.state.ingredients,
          instructions: this.state.instructions,
          fileId:
            this.state.imageId === "" ? DEFAULT_IMAGE_ID : this.state.imageId
        },
        mutation: gql`
          mutation addRecipe(
            $title: String!
            $description: String!
            $ingredients: [String!]!
            $instructions: [String!]!
            $fileId: ID = ""
          ) {
            createRecipe(
              title: $title
              description: $description
              ingredients: $ingredients
              instructions: $instructions
              fileId: $fileId
            ) {
              id
              title
              file {
                id
              }
            }
          }
        `
      })
      .then(() => {
        this.props.navigation.state.params.refetch();
        this.props.navigation.navigate("Home");
      });
  };

  public render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView
          enabled
          style={{ flex: 1 }}
          keyboardVerticalOffset={-200}
        >
          <View style={styles.fields}>
            <Caption style={styles.caption}>Name of recipe</Caption>
            <TextInput
              style={styles.caption}
              value={this.state.title}
              onChangeText={text => this.setState({ title: text })}
            />
          </View>
          <View style={styles.fields}>
            <Caption style={styles.caption}>Description</Caption>
            <TextInput
              style={styles.caption}
              value={this.state.description}
              onChangeText={text => this.setState({ description: text })}
            />
          </View>

          <View style={styles.fields}>
            <Caption style={styles.caption}>Ingredients(one per field)</Caption>
            {this.state.ingredients.map((item, index) => (
              <TextInput
                key={index}
                style={styles.caption}
                value={this.state.ingredients[index]}
                onChangeText={text =>
                  this.setState(prevState => ({
                    ingredients: _.concat(prevState.ingredients, "")
                  }))
                }
              />
            ))}
            <Button raised onPress={this.handleAddIngredients}>
              Add another ingredient
            </Button>
          </View>
          <View style={styles.fields}>
            <Caption style={styles.caption}>
              Instructions(one per field)
            </Caption>
            {this.state.instructions.map((item, index) => (
              <TextInput
                key={index}
                style={styles.caption}
                value={this.state.instructions[index]}
                onChangeText={text =>
                  this.setState(prevState => ({
                    instructions: _.concat(prevState.instructions, "")
                  }))
                }
              />
            ))}
            <Button raised onPress={this.handleAddInstructions}>
              Add another instruction
            </Button>
          </View>
          <UploadImage
            imageUri={this.state.imageUri}
            uploadImage={imageUri => this.handleImageUpload(imageUri)}
          />

          <Button
            disabled={
              this.state.title === "" ||
              this.state.description === "" ||
              _.last(this.state.ingredients) === "" ||
              _.last(this.state.instructions) === ""
            }
            raised
            onPress={this.handleUploadRecipe}
          >
            Submit
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default CreateRecipeForm;

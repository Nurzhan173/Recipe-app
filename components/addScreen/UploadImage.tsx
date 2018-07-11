import {ActivityIndicator, StyleSheet, Image, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Permissions, ImagePicker } from "expo";

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: 200,
    height: 200
  }
});


class UploadImage extends React.Component {
  state = {
    uploaded: true
  }

  handleUploadPress = async () => {
    this.setState({
      uploaded: false,
    })
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const photo = await ImagePicker.launchImageLibraryAsync();

    this.props.uploadImage(photo.uri)
    this.setState({
      uploaded: true
    })
    
  };

  public render() {
    return (
      <View>
        {!this.state.uploaded && (<ActivityIndicator/>)}
        {this.props.imageUri !== "" && (
          <Image style={styles.image} source={{ uri: this.props.imageUri }} />
        )}
        <Button raised onPress={this.handleUploadPress}>
          Upload Photo
        </Button>
      </View>
    );
  }
}

export default UploadImage;

// Libraries
import React , { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

class LiveView extends Component{

  state = {
    coords:     null,
    direction:  '',
    status:     null,   //permissions
  }

  render() {
    const status = this.state.status;

    if (status === null){
      // loading spinner
      return (
        <ActivityIndicator />
      );
    }
    if (status === 'denied'){
      // user has denied this permission
      return (
        <View>
          <Text>Phone Permissions Denied</Text>
        </View>
      );
    }
    if (status === 'undetermined'){
      // user has neither granted nor denied the permission
      return (
        <View>
          <Text>Phone Permissions Undetermined</Text>
        </View>
      );
    }
    // (else) permission is granted
    return (
      <View>
          <Text>{JSON.stringify(this.state)}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: primaryColor,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText :{
    color: white,
    fontSize: 20,
  }
})

export default LiveView

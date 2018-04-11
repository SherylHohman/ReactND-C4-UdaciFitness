// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         ActivityIndicator, StyleSheet
       } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { white, primaryColor } from '../utils/colors';

class LiveView extends Component{

  state = {
    coords:     null,
    direction:  '',
    status:     'undetermined',   //Permissions
    // TODO: reset status to null when finish coding UI for each value
  }

  askPermission(){
    // TODO: open/enable Phone's Location Permissions
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
        <View style={styles.center}>
          <Foundation name='alert' size={50} />  {/* this is an icon */}
          <Text>You need to enable Location Services</Text>
          <Text>in order to view this page</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={this.onPress}
            >
            <Text>Enable</Text>
          </TouchableOpacity>
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

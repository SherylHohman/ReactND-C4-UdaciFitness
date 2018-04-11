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
    status:     null,   //Permissions
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
        <View style={styles.center}>
          <Foundation name='alert' size={50} />
          <Text>
            You denied your location.
            You can fix this by visiting your settings and enabling location services for this app.
          </Text>
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
    // best to check this explicitly!! (as opposed to an "else" assumption)
    if (status === 'granted'){
      return (
        <View style={styles.container}>

          <View style={styles.directionContainer}>
            <Text style={styles.header}>You're heading</Text>
            <Text style={styles.direction}>
              {/* TODO: swap Hard Coded values for Live values */}
              North
            </Text>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Altitude
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {/* TODO: swap Hard Coded values for Live values */}
                {200} feet
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Speed
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {/* TODO: swap Hard Coded values for Live values */}
                {300} MPH
              </Text>
            </View>
          </View>

        </View>
      );
    }
    // could move the "undetermined" option here as the default catch-all
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
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
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: primaryColor,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: primaryColor,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
})

export default LiveView

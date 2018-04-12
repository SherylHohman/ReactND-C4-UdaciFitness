// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         ActivityIndicator, StyleSheet
       } from 'react-native';
import { Permissions, Location } from 'expo';
// Helpers
import { calculateDirection } from '../utils/helpers';
// Icons, Constants
import { Foundation } from '@expo/vector-icons';
import { white, primaryColor } from '../utils/colors';

class LiveView extends Component{

  state = {
    coords:     null,
    direction:  '',
    status:     null,   //Permissions
  }

  componentDidMount(){
    Permissions.getAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted'){
          // TODO: why does this block preceed setState??
          //    is setState still going to be called, after `return` ?  (obviously "yes", but why/how??)
          //    who/what is consuming this `return` statement ?
          return this.setLocation();
        }

        this.setState({ status });
      })

      .catch((error) => {
        console.warn('____error GETTING Location permission: ', error)
        this.setState({ status: 'undetermined'});
      })
    }

  askPermission = () => {
    // Opens phone's native dialog, asking to enable Phone's Location Permissions
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted'){
          // TODO: why does this block preceed setState??
          //    is setState still going to be called, after `return` ?  (obviously "yes", but why/how??)
          //    who/what is consuming this `return` statement ?
          return this.setLocation();
        }

        this.setState({ status });
      })

      .catch((error) =>
        console.warn('____error ASKING User for Location permission: ', error)
      )
  }

  setLocation = () => {
    // Read phone Location info (direction, speed, altitude)
    // Then update State

    Location.watchPositionAsync(
      // first parameter is the Options
      {
        enableHighAccuracy: true,
        // how often to poll for changes in phone location
        timeInterval: 1,
        distanceInterval: 1,
      },

      // second parameter is the callback, called whenever the location updates
      ({ coords }) => {
        this.setState(() => ({
          coords,
          status: 'granted',
          // returns "West", for example
          direction: calculateDirection(coords.heading),
        }));
      }
    );
}

  render() {
    const status = this.state.status;

    if (status === null){
      // loading spinner
      return (
        <ActivityIndicator style={{marginTop: 30}}/>
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
            onPress={this.askPermission}
            >
            <Text>Enable</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // I prefer to check this explicitly!! (as opposed to an "else/fall-through" assumption)
    if (status === 'granted'){
      const { direction, coords } = this.state;

      // Note: ios Simulator -> Debug -> GPS -> (city bicycle ride) to run GPS simulator
      return (
        <View style={styles.container}>

        <Text>{JSON.stringify(this.state)}</Text>

          <View style={styles.directionContainer}>
            <Text style={styles.header}>You're heading</Text>
            <Text style={styles.direction}>
              {/* TODO: swap Hard Coded values for Live values */}
              {direction}
            </Text>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Altitude
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {/* TODO: swap Hard Coded values for Live values */}
                {Math.round(coords.altitude * 3.2808)} Feet
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Speed
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {/* TODO: swap Hard Coded values for Live values */}
                {(coords.speed * 2.2369).toFixed(1)} MPH
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

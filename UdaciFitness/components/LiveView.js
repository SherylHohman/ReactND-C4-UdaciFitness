// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         ActivityIndicator, StyleSheet, Animated,
       } from 'react-native';
import { Permissions, Location } from 'expo';
// Helpers
import { calculateDirection } from '../utils/helpers';
// Icons, Constants
import { Foundation } from '@expo/vector-icons';
import { white, primaryColor } from '../utils/colors';

class LiveView extends Component{

  state = {
    //Permissions
    status:     null,
    // Location Data
    direction:  '',
    altitudeFeet: 0,
    speedMph    : 0,
    // For animation
    bounceValue : new Animated.Value(1),
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
        const newDirection = calculateDirection(coords.heading);

        // create animation sequence (animates Compass Direction styling)
        const { direction, bounceValue } = this.state;
        if (newDirection !== direction) {
          Animated.sequence([
            Animated.timing(bounceValue, {toValue: 1.04, duration: 200}),
            Animated.spring(bounceValue, {toValue: 1   , friction:   4}),
          ]).start();
        }

        this.setState(() => ({
          status: 'granted',
          // returns "West", for example
          direction:    newDirection,
          altitudeFeet: Math.round(coords.altitude * 3.2808),
          speedMph:     (coords.speed * 2.2369).toFixed(1),
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
    // I prefer to check GRANTED explicitly!! (as opposed to an "else/fall-through" assumption)
    if (status === 'granted'){
      const { direction, speedMph, altitudeFeet, bounceValue } = this.state;

      // Note: ios Simulator -> Debug -> GPS -> (city bicycle ride) to run GPS simulator
      return (
        <View style={styles.container}>

          <View style={styles.directionContainer}>
            <Text style={styles.header}>You're heading</Text>
            <Animated.Text
              style={[styles.direction, {transform: [{scale: bounceValue}]}, ]}
              >
              {direction}
            </Animated.Text>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Altitude
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {altitudeFeet} Feet
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={[styles.header, {color: white}]}>
                Speed
              </Text>
              <Text style={[styles.subHeader, {color: white}]}>
                {speedMph} MPH
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

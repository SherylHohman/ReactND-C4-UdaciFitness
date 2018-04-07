// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         Platform, StyleSheet
       } from 'react-native';

import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
// Helpers, Utils, etc
import { getMetricMetaInfo, timeToString,
         getDailyReminderValue
       } from '../utils/helpers';
import { purple, white } from '../utils/colors'
// api
import { submitEntry, removeEntry } from '../utils/api';
// Actions
import { receiveEntries, addEntry } from '../actions';
// Components
import DateHeader    from './DateHeader';
import UdaciSteppers from './UdaciSteppers';
import UdaciSlider   from './UdaciSlider';
import TextButton    from './TextButton';


class AddEntry extends Component {

  state = {
    bike:  0,
    run:   0,
    swim:  0,
    sleep: 0,
    eat:   0,
  }

  reset = () => {
    // key is today's date
    const key = timeToString();

    // Update Redux
    // store for today will have an object with just a "today" property on it (that contains a user mesage)
    // (in contrast, when "submt" is pressed, store and "DB" have the same entry value for "today")
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue(),
    }));

    // TODO: Navigate to home

    // Save to "DB", actually phone's local storage
    // "DB" (local storage) will have will be "undefined" for today
    removeEntry({ key });
  }

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // Update Redux
    // store (and "DB", see below) will both have an entry for today with stats from state, above
    this.props.dispatch(addEntry({
      [key]: entry,
    }));

    // reset state
    this.setState( () => ({
      bike:  0,
      run:   0,
      swim:  0,
      sleep: 0,
      eat:   0,
    }));

    // TODO: Navigate to home

    // Save to "DB", actually phone's local storage
    // store (see above) has the same (unlike when "reset" is pressed)
    submitEntry({ key, entry });

    // TODO: Clear local notification
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const newValue = state[metric] + step;
      return ({
        ...state,
        [metric]: (newValue>max) ? max : newValue,
      });
    });
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const newValue = state[metric] - step;
      return ({
        ...state,
        [metric]: (newValue<0) ? 0 : newValue,
      });
    });
  }

  slide = (metric, value) => {
    this.setState({ [metric]: value })
  }

  render(){
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged){
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS ==='ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged data for this date</Text>
          <TextButton onPress={this.reset} btnStyle={{padding:10}}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>

        <DateHeader date={(new Date()).toLocaleDateString()} />
        <Text>  </Text>

        <View>
          {Object.keys(metaInfo).map(key => {
            const { displayName, getIcon, type, ...rest } = metaInfo[key];
            const value = this.state[key];
            return (
              <View key={key} style={styles.row}>
                <Text> {displayName} </Text>
                {getIcon()}

                {(type === 'steppers')
                  ? <UdaciSteppers
                        value={value}
                        onIncrement={(value) => this.increment(key)}
                        onDecrement={(value) => this.decrement(key)}
                        { ...rest }
                      />
                  : <UdaciSlider
                        value={value}
                        onChange={(value) => this.slide(key, value)}
                        { ...rest }
                      />
                }

                <Text>  </Text>
              </View>
            )
          })}
        </View>

        <TextButton onPress={this.submit}
          btnStyle={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
          txtStyle={styles.text}
        >
          SUBMIT
        </TextButton>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems:     'center',
    marginLeft: 30,
    marginRight: 30,
    alignSelf: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2,
    height: 45,
    marginLeft: 30,
    marginRight: 30,

    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
});

function mapStoreToProps(store){
  const key = timeToString();

  return {
    alreadyLogged: (store[key] && (typeof store[key].today === 'undefined')),
  }
  // if today's data was reset, then store for today will have an unusual value:
  // it won't be defined, instead we set it to a custome message, that is stored
  //  in the property "today".  `today` will be the 1 and only key in "entry"
  //  However, note that this "today" property is NOT saved to the database.
  // so it is local, transient, and unique to "today" only.  And ONLY if we
  // cleared/deleted already saved values.
  // If no values have been previously saved, then store[key] will NOT EVEN EXIST ("undefined")
  // REM "key" is today's date (in the format required b the calendar library).

}

export default connect(mapStoreToProps)(AddEntry);


  // Question: key is a reference to today's date.
    // We keep re-computing it, rather than just setting it here for props, where we reference it later.
    // If we go past midnight, then the date referenced when an entry is later saved to the DB
    // would then get saved as "tomorrow" (possible problem if time changes while entering)
    //  ..additionally, the "already logged" variable could become out of synch
    //  so the View could show "already logged today..", or "remember to log" when it should not.
    //  They probably have us doing the "better case" scenario.  But it's worth considering
    //  noticing, and/or thinking about.

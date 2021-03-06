// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         Platform, StyleSheet
       } from 'react-native';

import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
// Helpers, Utils, etc
import { getMetricMetaInfo, timeToString,
         getDailyReminderValue,
         clearLocalNotification, setLocalNotification,
       } from '../utils/helpers';

import { primaryColor, white } from '../utils/colors'
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
    // key is the date we are resetting data for
    const key = this.props.entryId;

    // Update Redux
    // store for today will have an object with just a "today" property on it
    // (that contains a user mesage). This does *not* get saved to the DB.
    if (this.props.isToday) {
      this.props.dispatch(addEntry({
        [key]: getDailyReminderValue(),
      }));
    }

    // Return to History id got here from a card,
    // Return to Home, if got here by clicking on 'AddEntry' Tab
    //  (b/c Home is the only location that shows the 'AddEntry' Tab)
    //  (If that changes, this line may need to be edited)
    this.props.navigation.goBack();

    // Save to "DB", actually phone's local storage
    removeEntry({ key });
  }

  submit = () => {

    const key = this.props.entryId;
    const entry = this.state;

    // Update Redux store
    this.props.dispatch(addEntry({
      [key]: entry,
    }));

    // Save to "DB", (phone's local storage, actually)
    submitEntry({ key, entry });

    // clears notification for today, sets a new one for tomorrow, (8pm)
    clearLocalNotification()
      .then(setLocalNotification);

    // reset state
    this.setState( () => ({
      bike:  0,
      run:   0,
      swim:  0,
      sleep: 0,
      eat:   0,
    }));

    // Returns to History if got here from a card, or
    // Returns Home, if got here by clicking on 'AddEntry' Tab
    //  (b/c Home is the only location that shows the 'AddEntry' Tab)
    //  (If that changes, this line may need to be edited)
    this.props.navigation.goBack();
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
          {this.props.isToday
            ? <Text>You already logged data for today</Text>
            : <Text>You already logged data for this date</Text>
          }
          <TextButton onPress={this.reset} btnStyle={{padding:10}}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>

        <DateHeader date={this.props.formattedDate} />

        {Object.keys(metaInfo).map(key => {
          const { displayName, getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key} style={styles.row}>
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
            </View>
          )
        })}

        <TextButton onPress={this.submit}
          btnStyle={Platform.OS === 'ios'
            ? styles.iosSubmitBtn
            : styles.androidSubmitBtn
          }
          txtStyle={styles.btnText}
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
    flexDirection:  'row',
    flex: 1,
    alignItems:     'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems:     'center',
    marginLeft:  30,
    marginRight: 30,
  },
  // TODO: can these be moved inside TextButton ?
  iosSubmitBtn: {
    backgroundColor: primaryColor,
    padding: 10,
    height: 45,
    borderRadius: 7,
    marginLeft:  40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: primaryColor,
    padding: 10,
    height: 45,
    borderRadius: 2,
    marginLeft:  30,
    marginRight: 30,

    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems:     'center',
  },
  btnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
});

function mapStoreToProps(store, ownProps){

  let entryId, formattedDate;
  const dateToday = timeToString();

  if (ownProps.navigation.state.params) {
      // got here by clicking on a card from History component
      entryId       = ownProps.navigation.state.params.entryId;
      formattedDate = ownProps.navigation.state.params.formattedDate;
  }
  else {
      // got here by clicking on EditEntry TAB.
      //   date is NOT passed in - this tab ALWAYS modifies TODAY's data
      // TODO: add date selected on Calendar to Store, so EditEntry Tab can
      //   edit data for the Selected Date, whether that is Today or Not !
      entryId       = dateToday;
      formattedDate = new Date().toLocaleDateString();
  }

  const isToday = (entryId === dateToday);

  // see explanation below
  const alreadyLogged = (
    (!isToday && store[entryId])  ||
    ( isToday && store[dateToday] && (typeof store[dateToday].today === 'undefined'))
  );

  return {
    entryId,
    isToday,
    alreadyLogged,
    formattedDate,
  }
}

export default connect(mapStoreToProps)(AddEntry);


  // NOTE: Notifications cannot be tested on ios
    //  neither in Simulator, nor on an ios phone running expo (as per Apple)
    //  can only be tested on Android.

  // "WARNING: AddEntry: `key` is not a prop.
    // Trying to access it will result in `undefined` being returned.
    // If you need to access the same value within the child component,
    // you should pass it as a different prop.
    // (https://fb.me/react-special-props)
    // "

  // NOTE: for alreadyLogged, and the 'today' property (store[someDate].today)
    // If today's data was reset, then store for today will have an unusual value:
    // it won't be defined, instead it is set to a custome message that is stored
    //  in the property "today".
    //  `today` will be the 1 and only key in "entry"
    //  However, note that this "today" property is NOT saved to the database.
    // so it is local, transient, and unique to "today" only.  And ONLY if we
    // cleared/deleted already saved values.
    // If no values have been previously saved for this date, then
    // store[someDate] will NOT EVEN EXIST ("undefined")
    // REM "someDate" is a date in the format required by the calendar library).

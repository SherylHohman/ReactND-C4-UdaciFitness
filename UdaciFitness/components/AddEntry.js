import React , { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import { submitEntry, removeEntry } from '../utils/api';
import { receiveEntries, addEntry } from '../actions';

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
        <View>
          <Ionicons
            name={'ios-happy-outline'}
            size={100}
          />
          <Text>You already logged data for this date</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <Text> ..Add 2 temp lines so component data renders below phone status bar </Text>
        <Text>  </Text>

        <DateHeader date={(new Date()).toLocaleDateString()} />
        <Text>  </Text>

        <View>
          {Object.keys(metaInfo).map(key => {
            const { displayName, getIcon, type, ...rest } = metaInfo[key];
            const value = this.state[key];
            return (
              <View key={key}>
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

        <TextButton onPress={this.submit}>
          SUBMIT
        </TextButton>

      </View>
    )
  }
}

export default connect()(AddEntry);

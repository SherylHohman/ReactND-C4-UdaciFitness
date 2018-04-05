import React , { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getMetricMetaInfo, timeToString } from '../utils/helpers';

import DateHeader    from './DateHeader';
import UdaciSteppers from './UdaciSteppers';
import UdaciSlider   from './UdaciSlider';
import TextButton    from './TextButton';


export default class AddEntry extends Component {

  state = {
    bike:  0,
    run:   0,
    swim:  0,
    sleep: 0,
    eat:   0,
  }

  reset = () => {
    const key = timeToString();

    // TODO: Update Redux

    this.setState( () => ({
      bike:  0,
      run:   0,
      swim:  0,
      sleep: 0,
      eat:   0,
    }));

    // TODO: Navigate to home

    // TODO: Save to DB

    // TODO: Clear local notification
  }

  submit = () => {
    // const entry = this.state;

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

      {/* This Reset Button is TEMP for testing purposes only. Normally it ONLY appears in conditional render at top of render method */}
        <TextButton onPress={this.reset}>
          Reset
        </TextButton>



      </View>
    )
  }
}

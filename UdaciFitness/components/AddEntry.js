import React , { Component } from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import DateHeader from './DateHeader';

export default class AddEntry extends Component {

  state = {
    bike:  0,
    run:   0,
    swim:  0,
    sleep: 0,
    eat:   0,
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

    return (
      <View>
        <Text> ..Add 2 temp lines so component data renders below phone status bar </Text>
        <Text>  </Text>

        <DateHeader date={(new Date()).toLocaleDateString()} />
        <Text>  </Text>

        {Object.keys(metaInfo).map(key => {
          const { displayName, getIcon } = metaInfo[key];
          return (
            <View key={key}>
              <Text> {displayName} </Text>
              {getIcon()}
              <Text>  </Text>
            </View>
          )
        })}

      </View>
    )
  }
}

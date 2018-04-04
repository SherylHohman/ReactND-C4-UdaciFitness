import React , { Component } from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';

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
    return (
      <View>
        <Text> AddEntry </Text>
        {getMetricMetaInfo('bike').getIcon()}
      </View>
    )
  }
}

// Libraries
import React , { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
// Actions
import { receiveEntries, addEntry } from '../actions';
// Helpers, Utils, Constants, etc
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { purple, white } from '../utils/colors'


class History extends Component {

  render(){
    return (
      <View>
        <Text>History Component Placeholder</Text>
      </View>
    );
  }

}

export default History

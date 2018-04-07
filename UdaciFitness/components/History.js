// Libraries
import React , { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
// api
import { fetchCalendarResults } from '../utils/api';
// Actions
import { receiveEntries, addEntry } from '../actions';
// Helpers, Utils, Constants, etc
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { purple, white } from '../utils/colors'


class History extends Component {

  componentDidMount(){
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then( (entries) => dispatch(receiveEntries(entries))
      .then( ({ entries }) => {
        // don't have any info entered today
        // then set redux store for today to be "today: don't forget..."
        // Note: we don't put this value into the DB, only into the redux store
        if (!entries[timeToString]){
          dispatch(addEntry({
            [timeToString]: getDailyReminderValue()
          }));
        }
      }));
  }

  render(){
    return (
      <View>
        <Text>{JSON.stringify(this.props)}</Text>
      </View>
    );
  }

}

function mapStateToProps(store){
  const entries = store;
  return {
    entries,
  }
}

export default connect(mapStateToProps)(History)

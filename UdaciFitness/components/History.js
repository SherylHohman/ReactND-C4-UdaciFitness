// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         StyleSheet, Platform
       } from 'react-native';

import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import UdaciFitnessCalendar from 'udacifitness-calendar';
// api
import { fetchCalendarResults } from '../utils/api';
// Actions
import { receiveEntries, addEntry } from '../actions';
// Components
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';
// Helpers, Utils, Constants, etc
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { white } from '../utils/colors'


class History extends Component {
  state = {
    ready: false,
  }

  componentDidMount(){
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then( (entries) => dispatch(receiveEntries(entries)))
      .then( ({ entries }) => {
        // don't have any info entered today
        // then set redux store for today to be "today: don't forget..."
        // Note: we don't put this value into the DB, only into the redux store
        if (!entries[timeToString]){
          dispatch(addEntry({
            [timeToString()]: getDailyReminderValue()
          }));
        }
      })
      .then(() => this.setState(() => ({ready: true})));
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => (
      <View style={styles.item}>
        {today
          ? <View>
              <DateHeader date={formattedDate} />
              <Text style={styles.noDataText}>
                {today}
              </Text>
            </View>
          : <View>
              <DateHeader date={formattedDate} />
              <TouchableOpacity
                onPress={() => console.log('ToDo: navigate to metrics page')}
                >
                <MetricCard
                  metrics={metrics}
                  date={formattedDate}
                />
              </TouchableOpacity>
            </View>
        }
      </View>
    )
  renderEmptyDate(formattedDate){
    // if store has "today" value (the generic message to remember to log data today)
    // this value is not saved to "DB"/Async
    // it is only on the current date, and only in the store.
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          No Data for this Date
        </Text>
      </View>
    )
  }

  render(){
    const { entries } = this.props;

    if (!this.state.ready){
      return (
        <View><Text>fetching your data..</Text></View>
      );
    }

    return (
      // TODO: Android shows all prev fetched data, even when
      //  selected date has changed to a later date.
      //  It *should*  only show data from selected date to present.
      //  ios is working as expected.
      //    eg: select 7th (today) shows today.
      //    now select 6th (yesterday). shows yesterday and today
      //    now select 7th again. Should just show today,
      //                          but still shows yesterday's data also.
      // Is this a known issue with the udacifitness-calendar api ?
      // or is my app preventing proper display, fetch, or store of data ?

      <UdaciFitnessCalendar
        // calendar takes 2 callbacks. It checks our (items) data, then calls
        // the appropriate callback. If the data for that date is null or not.
        // It will render all info from the selected date to the present day.
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    backgroundColor: white,
    padding:     20,
    marginLeft:  10,
    marginRight: 10,
    marginTop:   17,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop:    12,
    paddingBottom: 15,
  }
})

function mapStateToProps(store){
  const entries = store;
  return {
    entries,
  }
}

export default connect(mapStateToProps)(History)

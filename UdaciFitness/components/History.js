// Libraries
import React , { Component } from 'react';
import { View, Text, TouchableOpacity,
         StyleSheet, Platform
       } from 'react-native';

import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
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
import { white, primaryColor, primaryColorLighter, secondaryColor } from '../utils/colors'


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
        // so set redux store for today to be "today: don't forget..."
        // Note: we don't put this value into the DB, only into the redux store
        if (!entries[timeToString()]){
          dispatch(addEntry({
            [timeToString()]: getDailyReminderValue()
          }));
        }
      })
      .then(() => this.setState({ready: true}));
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
                /* this.props.navigation.navigate is automatically passed in */
                /* by MainNavigation (a StackNavigator component) defined in App.js */
                /* any "route" (key Name) defined in MainNavigation */
                /* can be navigated to via its navigate() method */
                onPress={() => this.props.navigation.navigate(
                  'EntryDetail',
                  /* below value will be passed in to the 'EntryDetail' component (above) */
                  /* as: this.props.navigation.state.params.entryId*/
                  { entryId: key }
                )}
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
  renderEmptyDate = (formattedDate) => {
    // if store has "today" value (the generic message to remember to log data today)
    // this value is not saved to "DB"/Async
    // it is only on the current date, and only in the store.

    // To allow adding data for this date.
    // calendar does not pass in 'key' (this date, in the format required for calendar)
    //  for this callback, so re-create it here:
    //  Convert formattedDate to timeToString format.
    //  (formattedDate is a Date.toLocalDateFormat format, so parse *should* work)
    const key = timeToString(Date.parse(formattedDate));

    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(
              'AddEntry',
              /* below value will be passed into the component */
              /* as: this.props.navigation.state.params.entryId*/
              { entryId: key }
            )}
            >
            <Text style={styles.noDataText}>
              No Data Logged for this Date {'\n'}
              Click to Add
            </Text>
          </TouchableOpacity>
      </View>
    )
  }

  render(){
    const { entries } = this.props;

    if (!this.state.ready){
        return (
          <View>
            {/* As Per docs - it's a blank scree, not a loading spinner */}
            <AppLoading />
            <Text style={styles.noDataText}>Loading your data..</Text>
          </View>
        );
    }

    return (
      <UdaciFitnessCalendar
        // calendar takes 2 callbacks. It checks our (items) data, then calls
        // the appropriate callback. If the data for that date is null or not.
        // It will render all info from the selected date to the present day.
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        theme={calendarTheme}
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
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    // account for shadow on ios
    // so bottom background of UdaciFitnessCalendar does Not get Cut Off
    marginBottom:  Platform.OS === 'ios' ? 12 : 10,
  },
  noDataText: {
    fontSize: 20,
    paddingTop:    12,
    paddingBottom: 10,
    // so bottom background of UdaciFitnessCalendar does Not get Cut Off
    // account for shadow on ios
    marginBottom:  Platform.OS === 'ios' ? 12 : 10,
  },
});

  // match calendar colors to main app color
  //  installed this fork : https://github.com/tylermcginnis/react-native-calendars/blob/master/src/agenda/style.js
  //  docs (orig pre-fork): https://github.com/wix/react-native-calendars
  const calendarTheme = {
    selectedDayBackgroundColor: primaryColor,
    todayTextColor: primaryColor,
    dotColor: primaryColor,
  }

function mapStateToProps(store){
  const entries = store;
  return {
    entries,
  }
}

export default connect(mapStateToProps)(History)

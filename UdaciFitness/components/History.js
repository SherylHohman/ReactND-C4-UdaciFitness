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
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(
                  'AddEntry',
                  /* below value will be passed in to the 'EntryDetail' component (above) */
                  /* as: this.props.navigation.state.params.entryId*/
                  { entryId: key, formattedDate, }
                )}
                >
                <DateHeader date={formattedDate} />
                <Text style={styles.noDataText}>
                  {today}
                </Text>
              </TouchableOpacity>
            </View>
          : <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(
                  'EntryDetail',
                  /* below value will be passed in to the 'EntryDetail' component (above) */
                  /* as: this.props.navigation.state.params.entryId*/
                  { entryId: key }
                )}
                >
                <DateHeader date={formattedDate} />
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

    // calcuate `key` (entryId - it is the date format used by calendar module)
    //   calendar passes "key" to renderItem, but NOT to renderEmptyDate
    //     So I recreate it here (and call it 'key' for consistency),
    //     even though in all cases *I* pass it to child components as "entryId"
    //   parse(formattedDate) spits out epocs, interpreted as LOCAL time, yet
    //   timeToString needs Date of UTC time.
    //   localToUTC is the offset in millisecs (unix epochs) to convert local to UTC
    //   key (aka entryId) accurately converted formattedDate to UTC, and in the
    //     string format used by the DB/store/calendar
    //   Clicking (on this "card") takes user to the
    //     AddEntry page *for this entryId date* so user can add data for *any*
    //     (past) date that does Not have saved data.

    const localToUTC = new Date().getTimezoneOffset() * 60000;
    const key = timeToString(new Date(Date.parse(formattedDate)+localToUTC));

    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(
            'AddEntry',
            /* below value will be passed into the component */
            /* at: this.props.navigation.state.params */
            { entryId: key,
              formattedDate,
            }
          )}
          >
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>
            No Data Logged for this Date {'\n'}
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
    // so bottom background of UdaciFitnessCalendar does Not get Cut Off
    // (difference in numbers accounts for shadow on ios)
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


// DATE CONVERSIONS
  // (passing date to AddEntry component via StackNavigator):
  // https://codeofmatt.com/2015/06/17/javascript-date-parsing-changes-in-es6/

  // since time zone is not indicated, parse will interpred the date as
  //  a LOCAL time zone. But it was computed as a UTC time

  // parse takes string and returns Unix EPOCHS.
  // format of the given string determines what timezone parse interprets the string as
  //  the assumed timezone affects the number of seconds spit out as the epoch.

  // parse will return the formattedDate as (unix epoch) LOCAL Time Zone
  // timeToString expects UTC, so eg. "date today" could display as "date yesterday"
  // Need to add timezone shift to parsed epochs before sending it to timeTostring()


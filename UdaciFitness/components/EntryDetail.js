import React , { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
// APIs and Actions
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
// Components
import MetricCard from './MetricCard';
import TextButton from './TextButton';
// Constants, Helpers
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { white } from '../utils/colors';

class EntryDetail extends Component{

  // this takes the navigationOptions, defined in App.MainNavigation
  // (created by params we passed into StackNavigator)
  // and *dynamically* adds a property to it.
  // this property, is `title`.
  // `navigationOptions.title` is a property defined by StackNavigator
  //  is a property that StackNavigator knows how to render
  //  (so basically we are overwriting its defalute value of: {title: ''})
  // ** Dynamically ** using data passed into this component

  // navigation is being pulled from this.props
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params;

    const year  = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day   = entryId.slice(8);

    // TODO: I'd like to also show the day of the week
    // actually I'd prefer this style: Mon, 9 Apr 2018

    return { title: `${month}/${day}/${year}`}
  }

  shouldComponentUpdate(nextProps){
    // When reset button is pressed, this.props.metrics changes.
    //   Then we navigate back to the History Page.
    //  But, before we actually navigate, the component will try to
    //  re-render.  If it does so when
    //  metrics===null OR only has a today property,
    //  then MetricCard will break, as it can only render actual metric data.
    // Thus, we tell the component to only update if
    // we have actual metric information for the day in question

    return (nextProps.entryId && nextProps.metrics && !nextProps.metrics.today);

    // alternatively, we could render a spinner if do not have metric data
  }

  reset(){
    const { goBack, entryId, remove } = this.props;

    // delete this entry from the "database" (AsynchStorage)
    removeEntry({
      key: entryId,
    });

    // store gets a slightly nuanced version, compared to the DB
    // if date is !today,
    //  store gets the value of: null, but does not delete it (as the DB does)
    // and if the entryId date *is* today,
    //  store instead gets a reminder message as today's value
    const value = (entryId === timeToString())
      ? getDailyReminderValue()
      : null
    const entry = {
      [entryId] : value
    } ;
    remove(entry);

    // this.props.navigation.goBack();
    goBack();
  }

  render () {
    return (
      <View style={styles.container}>
        <MetricCard metrics={this.props.metrics}/>
        <TextButton
        onPress={() => {this.reset()}}
        btnStyle={{}}
        >
        Reset
        </TextButton>
      </View>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

function mapDispatchToProps(dispatch, { navigation }){
  const { entryId } = navigation.state.params;
  return {
    remove: (entry) => dispatch(addEntry(entry)),

    // convenience func reference
    // (could just call this.props.navigation.goBack(), and not use mDTP)
    goBack: () => navigation.goBack(),
  }
}

function mapStoreToProps(store, { navigation }){
  // navigation is a prop automatically passed in by StackNavigator
  // props passed in/created by me from the "calling" component
  //  when I called navigation.navigate()
  //  get placed inside navigation.state.params by StackNavigator
    const { entryId } = navigation.state.params;

    // (store === metrics data)
    // get the metrics data saved for this date
    const metrics = store[entryId];

    return {
      // date we want Entry Detail for
      entryId,
      metrics,
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(EntryDetail)

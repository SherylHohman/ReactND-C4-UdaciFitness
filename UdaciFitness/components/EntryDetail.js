import React , { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
// Components
import MetricCard from './MetricCard';
import TextButton from './TextButton';
// Constants
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

  render () {
    return (
      <View style={styles.container}>
        <MetricCard metrics={this.props.metrics}/>
        <TextButton
        onPress={() => {}}
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

function mapStateToProps(store, { navigation }){
  // navigation is a prop automatically passed in by StackNavigator
  // props passed in/created by me from the "calling" component
  //  when I called navigation.navigate()
  //  get placed inside navigation.state.params by StackNavigator
    const { entryId } = navigation.state.params;

    // (store === metrics data)
    // get the metrics data saved for this date
    const metric = store[entryId];

    return {
      // date we want Entry Detail for
      entryId,
      metrics,
    }
}

export default connect(mapStateToProps)(EntryDetail)

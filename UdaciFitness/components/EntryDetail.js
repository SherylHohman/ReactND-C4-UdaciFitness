import React , { Component } from 'react';
import { View, Text } from 'react-native';

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

    // this.pros.navigation is passed in via StackNavigator (Main Navigation component)
    // ...state.params.entryId is passed in from the component that requested
    // navigation to this page when it called navigation.navigate('EntryDetail')
    //   any user defined props passed in when calling a StackNavigator
    //   navigate() method will be found on navigation's
    //   "params" property.
    const entryId = this.props.navigation.state.params.entryId;

    return (
      <View>
        <Text>
          Entry Detail Page for: {'\n'}
          {entryId}
        </Text>
      </View>
    )
  };
}

export default EntryDetail

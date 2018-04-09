import React , { Component } from 'react';
import { View, Text } from 'react-native';

class EntryDetail extends Component{

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

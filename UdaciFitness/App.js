import React from 'react';
import { View, ScrollView } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AddEntry from './components/AddEntry';
import History from './components/History';

// temp: disable showing react-native deprecation warnings in emulator
import {YellowBox} from 'react-native';
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <ScrollView>
          <View style={{flex:1, padding: 30}}>
            <History />
            {/* <AddEntry /> */}
          </View>
        </ScrollView>
      </Provider>
    );
  }
}

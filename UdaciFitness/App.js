import React from 'react';
import { View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AddEntry from './components/AddEntry';

// temp: disable showing react-native deprecation warnings in emulator
import {YellowBox} from 'react-native';
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
          <View style={{flex:1}}>
            <AddEntry />
          </View>
      </Provider>
    );
  }
}

import React from 'react';
import { View, ScrollView } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AddEntry from './components/AddEntry';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <ScrollView>
          <View>
            <AddEntry />
          </View>
        </ScrollView>
      </Provider>
    );
  }
}

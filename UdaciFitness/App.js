import React from 'react';
import { View, ScrollView } from 'react-native';
import AddEntry from './components/AddEntry';

export default class App extends React.Component {
  render() {
    return (
      <ScrollView>
        <View>
          <AddEntry />
        </View>
      </ScrollView>
    );
  }
}

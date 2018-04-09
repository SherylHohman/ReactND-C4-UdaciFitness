import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { View, ScrollView, Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import reducer from './reducers';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { white, primaryColor, primaryColorDark, secondaryColor } from './utils/colors';

// disable showing react-native deprecation warnings in emulator
import {YellowBox} from 'react-native';
console.disableYellowBox = true;

// returns a component
const Tabs = TabNavigator(
  // this first argument defines the tabs
  {
    History: {
      // name of component that gets loaded
      screen: History,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ tintColor }) =>  // icons only show in ios
          <Ionicons name='ios-bookmarks' size={30} color={tintColor} />
      },
    },
    AddEntry: {
      // component to load
      screen: AddEntry,
      navigationOptions: {
        tabBarLabel: 'Add Entry',
        tabBarIcon: ({ tintColor }) => // icons only show in ios
          <FontAwesome name='plus-square' size={30} color={tintColor} />
      },
    },
  },
  // this second argument sets the various options
  {
    navigationOptions: {
      // remove/do-not-display headers (that will be added to the app later)
      header: null
    },
    tabBarOptions: {
      // ios icon and text color; android text color
      activeTintColor:   Platform.OS === 'ios' ? primaryColor : white,
      // no effect on ios; on android this color blends with tab color
      pressColor: white,
      indicatorStyle: {
          // little underline thingy on selected tab in android (default: yellow)
          backgroundColor: primaryColorDark,
          // defaults to 2
          height: 3,
      },
      style: {
        height: 56,
        // background color for tabs (both: selected and not selected)
        backgroundColor: Platform.OS === 'ios' ? white  : primaryColor,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 1
      }
    }
  }
);


export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
          <View style={{flex: 1, paddingTop: 24}}>
            <Tabs />
          </View>
      </Provider>
    );
  }
}

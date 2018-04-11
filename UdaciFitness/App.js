import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { View, ScrollView, Platform, StatusBar } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Constants } from 'expo';  // to get the device-specific statusBar height
import { FontAwesome, Ionicons } from '@expo/vector-icons';
// reducers
import reducer from './reducers';

// Components
import AddEntry    from './components/AddEntry';
import History     from './components/History';
import EntryDetail from './components/EntryDetail';
import LiveView from './components/LiveView';
// Constants
import { white, primaryColor, primaryColorDark } from './utils/colors';

// disable showing react-native deprecation warnings in emulator
import {YellowBox} from 'react-native';
console.disableYellowBox = true;

function UdaciStatusBar({ backgroundColor, ...props }){
  // color blends with default statusbar color;
  //  default is..
  //  on ios: white => statusBarColor === background color
  //  android: gray => statusBarColor is Darker Blend of background color
  return (
    <View style={{
            backgroundColor,
            height:Constants.statusBarHeight,
          }}
      >
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        {...props}
      />
    </View>
  );
}

// this is like a nav bar in a web app
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
    LiveView: {
      screen: LiveView,
      navigationOptions: {
        tabBarLabel: 'Compass',
        tabBarIcon: ({ tintColor }) => // icons only show in ios
          <Ionicons name='ios-speedometer' size={30} color={tintColor} />
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

// This is like react-router in a web app
// Makes this.props.navigate.navigation() and this.props.navigate
//  available all components, so they can navigate to the "routes"/screens
//    defined below
//  Calling this.props.navigate.navigation('Home'), for example,
//    will navigate the App to the (Home screen) aka render the Tabs component.
// Returns a component
const MainNavigation = StackNavigator(
  //  This is like defining Routes in a web app
  {
    Home: {
      screen: Tabs,
    },
    EntryDetail: {
      screen: EntryDetail,
      navigationOptions: {
        // color of the "back" arrow
        headerTintColor: white,
        headerStyle: {
          // background color for the header
          backgroundColor: primaryColor,
        }
      }
    },
    // I am adding this so user can add data for a date other than "today"
    AddEntry: {
      screen: AddEntry,
      navigationOptions: {
        // color of the "back" arrow
        headerTintColor: white,
        headerStyle: {
          // background color for the header
          backgroundColor: primaryColor,
        }
      }
    },
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
          <View style={{flex: 1}}>
            <UdaciStatusBar
              backgroundColor={primaryColor}
              barStyle="light-content"
              />
            <MainNavigation />
          </View>
      </Provider>
    );
  }
}

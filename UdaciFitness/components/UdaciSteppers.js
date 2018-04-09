import React from 'react';
import { View, Text, TouchableOpacity,
         Platform, StyleSheet
       } from 'react-native';

import { FontAwesome, Entypo } from '@expo/vector-icons';
import { white, gray, primaryColor } from '../utils/colors'

export default function UdaciSteppers({ value, min, max, step, unit, onIncrement, onDecrement }){
  return (
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      {Platform.OS === 'ios'
        ?
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onDecrement}
              style={[styles.iosStepBtn, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}
              >
              <Entypo name='minus' color={primaryColor} size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onIncrement}
              style={[styles.iosStepBtn, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}
              >
              <Entypo  name='plus'  color={primaryColor} size={30} />
            </TouchableOpacity>
          </View>
        :
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onDecrement}
              style={[styles.androidStepBtn, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}
              >
              <FontAwesome name='minus' color={white} size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onIncrement}
              style={[styles.androidStepBtn, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}
              >
              <FontAwesome  name='plus'  color={white} size={30} />
            </TouchableOpacity>
          </View>
      }
          <View style={styles.metricCounter}>
              <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
              <Text style={{fontSize: 18, color: 'gray'}}>{unit}</Text>
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosStepBtn: {
    backgroundColor: white,
    borderColor: '#cc7a00',//==orange40,  //'#e68a00',//==orange45, //purple,
    borderWidth:   1,
    borderRadius:  3,
    padding:       5,
    paddingLeft:  25,
    paddingRight: 25,
  },
  androidStepBtn: {
    backgroundColor: primaryColor,
    borderRadius:  2,
    padding:       10,
    margin: 5,
  },
});


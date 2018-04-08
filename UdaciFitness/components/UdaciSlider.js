import React from 'react';
import { View, Text, Slider, StyleSheet, Platform } from 'react-native';
import { purple, gray } from '../utils/colors'

export default function UdaciSlider({ value, max, step, unit, onChange }){
  return (
    <View style={styles.row}>
    {Platform.OS==='ios'
      ?
        <Slider
          style={styles.slider}
          value={value}
          minimumValue={0}
          maximumValue={max}
          step={step}
          onValueChange={onChange}
          minimumTrackTintColor={purple}
        />
      :
        <Slider
          style={styles.slider}
          value={value}
          minimumValue={0}
          maximumValue={max}
          step={step}
          onValueChange={onChange}
          minimumTrackTintColor={purple}
          thumbTintColor={purple}         /* android only property */
        />
    }

      <View style={styles.metricCounter}>
        <Text style={{fontSize: 24, textAlign: 'center'}}>
          {value}
        </Text>
        <Text style={{fontSize: 18, color: 'gray'}}>
          {unit}
        </Text>
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
  slider: {
    flex: 1,
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

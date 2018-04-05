import React from 'react';
import { View, Text, Slider } from 'react-native';

export default function UdaciSlider({ value, max, step, unit, onChange }){
  return (
    <View>

      <View>
        <Slider
          value={value}
          minimumValue={0}
          maximumValue={max}
          step={step}
          onValueChange={onChange}
        />
      </View>

      <View>
        <Text>Value: {value}</Text>
        <Text>{unit}</Text>
      </View>

    </View>
  )
}

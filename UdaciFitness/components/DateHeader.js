import React from 'react';
import { Text } from 'react-native';
import { primaryColor } from '../utils/colors';

export default function DateHeader({ date }){
  return (
    <Text style={{color: primaryColor, fontSize: 25}}>
      {date}
    </Text>
  );
}

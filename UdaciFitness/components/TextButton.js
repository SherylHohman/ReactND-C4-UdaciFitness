import React from 'react';
import { Text, TouchableOpacity } from 'react-native'

export default function TextButton({ children, onPress, btnStyle={}, txtStyle={} }) {
  return (
      <TouchableOpacity onPress={onPress} style={btnStyle}>
        <Text style={txtStyle}>{children}</Text>
      </TouchableOpacity>
  )
}

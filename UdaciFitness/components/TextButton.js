import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { purple } from '../utils/colors';

export default function TextButton({ children, onPress, btnStyle={}, txtStyle={} }) {
  return (
      <TouchableOpacity onPress={onPress} style={btnStyle}>
        <Text style={[styles.reset, txtStyle]}>{children}</Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  reset: {
    textAlign: 'center',
    color: purple,
  }
})

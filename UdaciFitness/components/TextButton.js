import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { primaryColor } from '../utils/colors';

export default function TextButton({ children, onPress, btnStyle={}, txtStyle={} }) {
  return (
      <TouchableOpacity onPress={onPress} style={btnStyle}>
        <Text style={[styles.txtDefault, txtStyle]}>{children}</Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  txtDefault: {
    textAlign: 'center',
    color: primaryColor,
  }
})

//Libraries
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
// Coponents
import DateHeader from './DateHeader'
// Helpers, Utils, Constants
import { getMetricMetaInfo } from '../utils/helpers'
import { gray } from '../utils/colors'

export default function MetricCard({ metrics, date=null }) {
    return (
      <View>
        {/* - EntryDetail page diplays date in Header via StackNavigator */}
        {/* - and I chose to render my DateHeader from History component */}
        {/* this component just renders the metrics for today */}
        {/* {date && <DateHeader date={date} />} */}
        {/* TODO: I *could* remove `date`, as it is not needed */}
        {Object.keys(metrics)
          .map((metric) => {
            const { getIcon, displayName, unit } = getMetricMetaInfo(metric);
            return (
              <View style={styles.metric} key={metric}>
                {getIcon()}
                <View>
                  <Text style={{fontSize: 20}}>
                    {displayName}
                  </Text>
                  <Text style={{fontSize: 16, color: gray}}>
                    {metrics[metric]} {unit}
                  </Text>
                </View>
              </View>
            )
          })
        }
      </View>
    );
}

const styles = StyleSheet.create({
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 15,
  },
});

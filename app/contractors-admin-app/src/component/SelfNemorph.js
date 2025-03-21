import {StyleSheet, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

const SelfNemorph = ({children, size, style}) => {
  return (
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
        <View
          style={[
            styles.inner,
            {
              borderRadius: 10,
              // borderRadius: size / 2 || 40 / 2,
            },
          ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default SelfNemorph;

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors().cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topShadow: {
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    // borderRadius: 8,
    shadowColor: 'red',
  },
  bottomShadow: {
    borderLeftColor: Colors().lightShadow,
    borderTopColor: Colors().lightShadow,
    borderRightColor: Colors().darkShadow,
    borderBottomColor: Colors().darkShadow,
    borderWidth: 8,

    elevation: -20,
    shadowOpacity: 1,
    shadowRadius: 8,
    borderRadius: 8,
    shadowColor: 'yellow',
  },
});

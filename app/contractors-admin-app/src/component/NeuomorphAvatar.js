import React from 'react';
import { NeomorphFlex } from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';

const NeuomorphAvatar = ({ children, gap }) => {
  return (
    <NeomorphFlex
      darkShadowColor={Colors().darkShadow}
      lightShadowColor={Colors().lightShadow}
      style={{
        shadowOpacity: 1,
        shadowRadius: 8,
        borderRadius: 150,
        backgroundColor: Colors().cardBackground,
        padding: gap ? gap : 10,
      }}>
      <NeomorphFlex
        inner
        darkShadowColor={Colors().lightShadow}
        lightShadowColor={Colors().darkShadow}
        style={{
          shadowOpacity: 1,
          shadowRadius: 8,
          borderRadius: 150,
          backgroundColor: Colors().cardBackground,
        }}>
        {children}
      </NeomorphFlex>
    </NeomorphFlex>
  );
};

export default NeuomorphAvatar;

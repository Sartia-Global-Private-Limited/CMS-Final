import React from 'react';
import {NeomorphFlex} from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';

const NeumorphCard = ({children, lightShadowColor, darkShadowColor}) => {
  return (
    <NeomorphFlex
      darkShadowColor={darkShadowColor ? darkShadowColor : Colors().darkShadow}
      lightShadowColor={
        lightShadowColor ? lightShadowColor : Colors().lightShadow
      }
      style={{
        shadowRadius: 4,
        shadowOpacity: 0.8,
        borderRadius: 8,
        backgroundColor: Colors().cardBackground,
        borderColor: Colors().lightShadow,
        borderWidth: 1,
      }}>
      {children}
    </NeomorphFlex>
  );
};

export default NeumorphCard;

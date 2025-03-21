import React, { useEffect, useState } from 'react';
import { NeomorphFlex } from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';
import { useSelector } from 'react-redux';

const NeumorphCard = ({ children, lightShadowColor, darkShadowColor }) => {
  const { isDarkMode } = useSelector(state => state.getDarkMode);

  const [key, setKey] = useState(0); // Unique key for forcing re-renders
  const [cardBackgroundColor, setCardBackgroundColor] = useState(
    Colors().cardBackground,
  ); // Define state for card background color

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
    // Recalculate card background color based on isDarkMode
    const updatedBackgroundColor = Colors().cardBackground;
    setCardBackgroundColor(updatedBackgroundColor);
  }, [isDarkMode]);

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
        backgroundColor: cardBackgroundColor,
        borderColor: Colors().lightShadow,
        borderWidth: 1,
      }}>
      {children}
    </NeomorphFlex>
  );
};

export default NeumorphCard;

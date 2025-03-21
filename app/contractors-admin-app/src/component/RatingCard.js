import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomeCard from './CustomeCard';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import {Rating} from '@kolking/react-native-rating';
import Colors from '../constants/Colors';

const RatingCard = ({data, index, onRatingChange}) => {
  const [rating, setRating] = useState(0);

  const handleChange = useCallback(
    value => {
      // setRating(Math.round((rating + value) * 5) / 10),
      setRating(value);
      onRatingChange(value);
    },

    [rating],
  );

  return (
    <CustomeCard
      data={[
        {
          component: (
            <View
              style={{
                maxWidth: WINDOW_WIDTH * 0.6,
                height: WINDOW_HEIGHT * 0.15,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text
                numberOfLines={3}
                style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                {index + 1} . {data?.subject}
              </Text>
              <Rating
                size={40}
                rating={rating}
                onChange={handleChange}
                fillColor={Colors().pending}
                fractions={0}
              />
              <Text style={{}}>Rated {rating} out of 5</Text>

              {/* <Rating
                type="custom"
                ratingCount={5}
                // startingValue={rating}
                startingValue={0}
                fractions={0}
                onFinishRating={ratingCompleted}
                imageSize={30}
                tintColor={Colors().cardBackground}
                ratingColor={Colors().pending}
                ratingBackgroundColor={Colors().inputDarkShadow}
                showRating={true}
                // minValue={0}
              /> */}
            </View>
          ),
        },
      ]}
    />
  );
};

export default RatingCard;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  starContainerStyle: {
    backgroundColor: 'red',
  },
  ratingContainerStyle: {
    backgroundColor: 'green',
  },
});

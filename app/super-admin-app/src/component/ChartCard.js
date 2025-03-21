import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SeparatorComponent from './SeparatorComponent';
import NeumorphCard from './NeumorphCard';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';

const ChartCard = ({
  headerName, //key for displaying header of card
  data,
  cardStyle,
  containerStyle,
}) => {
  return (
    <View style={{...styles.mainView, containerStyle}}>
      {/* Request field */}
      <NeumorphCard>
        <View style={{...styles.cardContainer, cardStyle}}>
          {headerName && (
            <>
              <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                {headerName}
              </Text>
              <SeparatorComponent
                separatorColor={Colors().gray2}
                separatorHeight={0.5}
              />
            </>
          )}

          {/* view for request user */}
          <View
            style={{
              flexDirection: 'row',
              // columnGap: 10,
            }}>
            <View style={{flex: 1, alignContent: 'center'}}>
              {data.map((itm, index) => (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  {itm?.component ? (
                    itm?.component
                  ) : (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {
                          color: itm?.keyColor || Colors().pureBlack,
                        },
                      ]}>
                      {itm.value ? itm?.value : '--'}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </NeumorphCard>
    </View>
  );
};
// Custom comparison function for React.memo
function areEqual(prevProps, nextProps) {
  return prevProps.item === nextProps.item;
}

// export default memo(ChartCard, areEqual);
export default ChartCard;

const styles = StyleSheet.create({
  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    marginHorizontal: WINDOW_WIDTH * 0.03,
    marginVertical: WINDOW_HEIGHT * 0.01,
  },
  headingTxt: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
  },
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView2: {
    maxWidth: '50%',

    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

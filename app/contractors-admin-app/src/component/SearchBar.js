import { StyleSheet, View, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Neomorph } from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';
import { Icon } from '@rneui/base';
import IconType from '../constants/IconType';
import { WINDOW_WIDTH } from '../utils/ScreenLayout';

const SearchBar = ({
  searchHeight,
  searchWidth,
  placeholderText,
  onSearchIconPress,
  setSearchText,
}) => {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const delay = 500;
    const timerId = setTimeout(() => {
      setSearchText(searchInput);
    }, delay);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  return (
    <View style={styles.searchView}>
      <Neomorph
        inner={true}
        darkShadowColor={Colors().darkShadow}
        lightShadowColor={Colors().lightShadow}
        style={{
          margin: 1,
          shadowRadius: 4,
          shadowOpacity: 0.8,
          borderRadius: 8,
          backgroundColor: Colors().cardBackground,
          width: searchWidth ? searchWidth : WINDOW_WIDTH * 0.95,
          height: searchHeight ? searchHeight : 45,
          borderColor: Colors().lightShadow,
          borderWidth: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <View style={{ marginLeft: 10, width: '85%' }}>
            <TextInput
              placeholder={
                placeholderText ? placeholderText.toUpperCase() : 'SEARCH...'
              }
              onChangeText={val => {
                setSearchInput(val);
              }}
              placeholderTextColor={Colors().searchTxtColor}
              value={searchInput}
              style={{
                marginLeft: 0,
                fontSize: 15,
                color: Colors().pureBlack,
                fontWeight: '600',
                lineHeight: 21,
                letterSpacing: 1,
                // textTransform: 'uppercase',
                fontFamily: Colors().fontFamilyBookMan, //  for uppercase of value of text
              }}
            />
          </View>
          {searchInput === '' ? (
            <View
              style={{
                width: 44,
                height: 45,
                alignSelf: 'center',
                padding: 5,
                justifyContent: 'center',
              }}>
              <Icon
                name="search"
                type={IconType.Ionicons}
                color={Colors().gray}
                onPress={onSearchIconPress}
                size={25}
              />
            </View>
          ) : (
            <View style={{ width: '10%' }}>
              <Icon
                name="cross"
                type={IconType.Entypo}
                // onPress={onRightIconPress}
                color={Colors().gray}
                size={30}
                onPress={() => {
                  setSearchText('');
                  setSearchInput('');
                }}
              />
            </View>
          )}
        </View>
      </Neomorph>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchView: {
    marginTop: WINDOW_WIDTH * 0.02,
    marginHorizontal: WINDOW_WIDTH * 0.02,
    flexDirection: 'row',
    marginBottom: WINDOW_WIDTH * 0.02,
    // backgroundColor: 'red',
  },
});

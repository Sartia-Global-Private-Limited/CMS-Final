import {StyleSheet, Text, View, Image} from 'react-native';
import React, {memo} from 'react';
import {apiBaseUrl} from '../../config';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import NeuomorphAvatar from './NeuomorphAvatar';
import {Avatar} from '@rneui/themed';

const DropDownItem = ({item}) => {
  return (
    <View style={styles.listView} key={item?.value}>
      {item?.image !== undefined && (
        <NeuomorphAvatar gap={4}>
          <Avatar
            size={30}
            rounded
            source={{
              uri: item.image
                ? `${apiBaseUrl}${item.image}`
                : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
            }}
          />
        </NeuomorphAvatar>
      )}
      {item?.label && (
        <Text
          numberOfLines={2}
          style={[
            styles.inputText,
            {marginLeft: 10, color: Colors().pureBlack},
          ]}>
          {item.label}
        </Text>
      )}
    </View>
  );
};

// Custom comparison function for React.memo
function areEqual(prevProps, nextProps) {
  return prevProps.item === nextProps.item;
}

export default memo(DropDownItem, areEqual);

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

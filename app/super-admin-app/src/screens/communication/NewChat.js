/*    ----------------Created Date :: 19 - Sep -2023   ----------------- */

import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getUserForNewChat} from '../../redux/slices/communications/getUserForNewChatSlice';
import CustomeHeader from '../../component/CustomeHeader';
import NeumorphicDropDownList from '../../component/DropDownList';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphicButton from '../../component/NeumorphicButton';
import Colors from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import {AddNewChat} from '../../redux/slices/communications/getMessageSlice';

const NewChat = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const Listdata = useSelector(state => state.getUserForNewChat);

  useEffect(() => {
    dispatch(getUserForNewChat());
  }, [isFocused]);

  const handleSubmit = async () => {
    if (userId) {
      try {
        setLoading(true);
        const res = await dispatch(AddNewChat(userId)).unwrap();
        if (res.status) {
          setLoading(false);
          navigation.goBack();
          Toast.show({
            type: 'success',
            text1: res?.message,
            position: 'bottom',
          });
        } else {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: res?.message,
            position: 'bottom',
          });
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please Select User First',
        position: 'bottom',
      });
    }
  };

  return (
    <SafeAreaView>
      <CustomeHeader headerTitle={'Add New Chats'} />
      <View style={{margin: 10}}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.052}
          title={'User Id'}
          data={
            Listdata?.data?.data?.map((itm, i) => ({
              label: `${itm?.name} (${itm?.id})`,
              value: itm?.id,
              image: itm?.image,
            })) || []
          }
          onCancle={() => {
            setUserId('');
          }}
          placeHolderTxt={'user'}
          value={userId}
          onChange={val => {
            setUserId(val.value);
          }}
        />
      </View>
      <View style={{alignSelf: 'center', marginVertical: 10}}>
        <NeumorphicButton
          title={'ADD'}
          titleColor={Colors().purple}
          onPress={() => {
            handleSubmit();
          }}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewChat;

const styles = StyleSheet.create({});

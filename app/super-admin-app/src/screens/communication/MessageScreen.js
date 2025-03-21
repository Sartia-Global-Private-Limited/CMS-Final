import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import {Icon, Avatar} from '@rneui/base';
import {apiBaseUrl} from '../../../config';
import Images from '../../constants/Images';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/slices/authSlice';
import {socket} from '../../context/socket';
import {getSingleMessages} from '../../services/authApi';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import moment from 'moment';
import {store} from '../../redux/store';

const MessageScreen = ({route}) => {
  const {isDarkMode} = store.getState().getDarkMode;
  const item = route?.params?.item;
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [singleMessage, setSingleMessage] = useState([]);
  const {user} = useSelector(selectUser);
  const navigation = useNavigation();

  useEffect(() => {
    if (item?.sender_details?.id) {
      handlerMessage(item?.sender_details?.id);
    }
  }, []);

  const handleSendMessage = () => {
    socket.emit('chat', {
      senderId: user.unique_id,
      message: newMessage,
      receiverId: receiverId,
    });
    handlerMessage(receiverId);
    setNewMessage('');
  };

  const handlerMessage = async id => {
    try {
      setReceiverId(id);
      const res = await getSingleMessages(id);
      if (res.status) {
        setSingleMessage(res.data);
      } else {
        setSingleMessage([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 50}>
          {/* Header */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors().screenBackground,
              paddingVertical: 10,
              borderBottomColor: Colors().darkShadow,
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => navigation.goBack()}>
              <Icon
                name={'chevron-back'}
                type={IconType.Ionicons}
                color={Colors().black2}
              />
            </TouchableOpacity>
            <Avatar
              size={40}
              rounded
              source={{
                uri: item?.sender_details?.image
                  ? `${apiBaseUrl}${item?.sender_details?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: Colors().pureBlack,
                textTransform: 'uppercase',
                fontFamily: Colors().fontFamilyBookMan,
                fontWeight: '300',
                marginLeft: 10,
              }}>
              {item?.sender_details?.name}
            </Text>
          </View>

          {/* Main Content */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled">
            <ImageBackground
              resizeMode="cover"
              style={{
                minHeight: WINDOW_HEIGHT,
              }}
              source={
                isDarkMode
                  ? require('../../assests/images/wdbg.jpg')
                  : require('../../assests/images/wbg2.png')
              }>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  paddingVertical: 10,
                  paddingBottom: 10,
                }}>
                {singleMessage?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginHorizontal: 10,
                      padding: 10,
                      borderRadius: 18,
                      borderTopLeftRadius:
                        receiverId == item?.sender_id ? 0 : 10,
                      backgroundColor:
                        receiverId == item?.recipient_id
                          ? '#F1F1F599'
                          : '#C5E0EF99',
                      borderTopRightRadius:
                        receiverId == item?.recipient_id ? 0 : 10,
                      alignSelf:
                        receiverId == item?.recipient_id
                          ? 'flex-end'
                          : 'flex-start',
                    }}>
                    <Text
                      style={{
                        maxWidth: WINDOW_WIDTH * 0.65,
                        color: '#000',
                        textTransform: 'uppercase',
                        fontWeight: '500',
                        fontFamily: Colors().fontFamilyBookMan,
                      }}>
                      {item?.message_content}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors().pureBlack,
                        fontWeight: '300',
                        alignSelf:
                          receiverId == item?.recipient_id
                            ? 'flex-end'
                            : 'flex-start',
                      }}>
                      {moment(item?.timestamp).calendar()}
                    </Text>
                  </View>
                ))}
              </View>
            </ImageBackground>
          </ScrollView>

          {/* Input Box */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderTopWidth: 1,
              borderColor: '#ddd',
              backgroundColor: isDarkMode ? '#000' : '#fff',
            }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                backgroundColor: isDarkMode ? '#222' : '#f1f1f1',
                borderRadius: 20,
                paddingHorizontal: 15,
                color: isDarkMode ? '#fff' : '#000',
              }}
              placeholder="Type a message..."
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <Pressable
              onPress={handleSendMessage}
              style={{
                marginLeft: 10,
                backgroundColor: isDarkMode ? '#444' : '#ddd',
                padding: 10,
                borderRadius: 50,
              }}>
              <Text style={{fontSize: 18, color: Colors().purple}}>➤</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({});

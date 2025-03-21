/*    ----------------Created Date :: 18- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';

import React, {useState} from 'react';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import {Icon} from '@rneui/base';
import NeumorphicButton from '../../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import ImageViewer from '../../../component/ImageViewer';
import {apiBaseUrl} from '../../../../config';
import ScreensLabel from '../../../constants/ScreensLabel';
import NeumorphCard from '../../../component/NeumorphCard';

const ExpensePunchBillComponent = ({formik, type, edit_id, edit}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);
  const [billImage, setbillImage] = useState('');
  const [billTitle, setbillTitle] = useState('');

  const label = ScreensLabel();

  const selectPhotoTapped = async keyToSet => {
    return Alert.alert(
      // the title of the alert dialog
      'UPLOAD BILL IMAGE',
      // the message you want to show up
      '',
      [
        {
          text: 'cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'upload From Library',
          onPress: () => PhotoTapped('library', keyToSet),
        },
        {
          text: 'capture Photo',
          onPress: () => {
            PhotoTapped('camera', keyToSet);
          },
        },
      ],
    );
  };

  const PhotoTapped = async (type, keyToSet) => {
    if (type == 'camera') {
      if (true) {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true,
          },

          includeBase64: true,
        };

        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let source = {
              type: 'application/png',
              uri: response.assets[0].uri,
            };
            sendImageFunc(response, 'img', keyToSet);
          }
        });
      }
    } else if (type == 'library') {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        // selectionLimit: 10,
        storageOptions: {
          skipBackup: true,
        },
        includeBase64: true,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 80000) {
            sendImageFunc(response, 'img', keyToSet);
          } else {
            Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }
        }
      });
    } else if (type == 'pdf') {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: '',
          type: [types.pdf],
          copyTo: 'cachesDirectory',
        });

        if (response[0].size < 800000) {
          this.sendImageFunc(response, 'pdf');
        } else {
          Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const sendImageFunc = async (imageresponse, type, keyToSet) => {
    const imageData = `data:${imageresponse.assets[0].type};base64,${imageresponse.assets[0].base64}`;
    setbillImage(imageData);
  };
  return (
    <View style={styles.inputContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {formik.values?.transaction_images?.map((itm, idx) => (
          <View key={idx} style={{flexDirection: 'row'}}>
            {itm.image && (
              <View style={{marginRight: 10}}>
                {/* Add margin for spacing between items */}
                <View style={styles.crossIcon}>
                  <Icon
                    name="close"
                    type={IconType.AntDesign}
                    size={15}
                    color={Colors().pureBlack}
                    onPress={() =>
                      formik.setFieldValue(
                        `transaction_images.${idx}.image`,
                        '',
                      )
                    }
                  />
                </View>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    setImageModalVisible(true);
                    setImageUri(
                      edit_id && itm?.image.startsWith('/')
                        ? `${apiBaseUrl}${itm?.image}`
                        : `${itm?.image}`,
                    );
                  }}>
                  <Image
                    source={{
                      uri:
                        edit_id && itm?.image.startsWith('/')
                          ? `${apiBaseUrl}${itm?.image}`
                          : `${itm?.image}`,
                    }}
                    style={[styles.Image, {marginTop: 10}]}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.title,
                    {
                      color: Colors().pureBlack,
                      alignSelf: 'center',
                      maxWidth: WINDOW_WIDTH * 0.2,
                    },
                  ]}
                  numberOfLines={2}>
                  {itm.title}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: 10,
        }}>
        <NeumorphCard
          lightShadowColor={Colors().darkShadow2}
          darkShadowColor={Colors().lightShadow}>
          <Icon
            name="plus"
            type={IconType.AntDesign}
            color={Colors().aprroved}
            style={styles.actionIcon}
            onPress={() => {
              setVisible(true);
            }}
          />
        </NeumorphCard>
        <Text
          style={[
            styles.title,
            {
              alignSelf: 'center',
              marginLeft: 10,
              color: Colors().aprroved,
            },
          ]}>
          Add bill
        </Text>
      </View>

      {/* <View style={styles.btnView}>
        <NeumorphicButton
          title={label.ADD_BILL}
          titleColor={Colors().pending}
          btnHeight={WINDOW_HEIGHT * 0.05}
          onPress={() => {
            setVisible(true);
          }}
          btnRadius={2}
          iconName={'upload'}
          iconType={IconType.Feather}
          iconColor={Colors().black2}
        />
      </View> */}
      {visible && (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {backgroundColor: Colors().screenBackground},
                ]}>
                <TouchableOpacity
                  style={[
                    styles.modalImage,
                    {backgroundColor: Colors().inputDarkShadow},
                  ]}
                  onPress={() => selectPhotoTapped()}>
                  {!billImage && (
                    <Icon
                      style={{alignSelf: 'center', marginTop: 10}}
                      name={'image'}
                      type={IconType.EvilIcons}
                      size={80}
                      color={Colors().gray2}
                    />
                  )}
                  {billImage && (
                    <Image
                      style={{
                        height: 100,
                        width: 350,
                        borderRadius: 8,
                      }}
                      source={{uri: billImage}}></Image>
                  )}
                </TouchableOpacity>

                <View style={{marginVertical: 10}}>
                  <NeumorphicTextInput
                    placeHolderTxt={'BILL TITLE'}
                    placeholderTextColor={Colors().gray2}
                    width={WINDOW_WIDTH * 0.75}
                    value={billTitle}
                    onChangeText={text => setbillTitle(text)}
                    style={[styles.inputText, {color: Colors().pureBlack}]}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 50,
                  }}>
                  <NeumorphicButton
                    title={label.CANCEL}
                    titleColor={Colors().red}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => {
                      setVisible(false), setbillImage(''), setbillTitle('');
                    }}
                  />

                  <NeumorphicButton
                    title={label.SAVE}
                    titleColor={Colors().aprroved}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => {
                      formik.setFieldValue(`transaction_images`, [
                        ...formik.values.transaction_images,
                        {image: billImage, title: billTitle},
                      ]);
                      setVisible(false);
                      setbillImage(''), setbillTitle('');
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
        />
      )}
    </View>
  );
};

export default ExpensePunchBillComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  modalImage: {
    borderRadius: 8,
    borderColor: Colors().pureBlack,
    height: 100,
    width: 350,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,

    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // rowGap: 8,
  },

  btnView: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },

  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -4,
    // top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },

  inputText: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

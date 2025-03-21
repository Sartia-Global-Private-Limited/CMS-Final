import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

import React, {useState} from 'react';
import SeparatorComponent from '../../../component/SeparatorComponent';
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

const BillComponent = ({item, index, formik, type, edit_id, edit}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);
  const [billImage, setbillImage] = useState('');
  const [billTitle, setbillTitle] = useState('');
  // useEffect(() => {}, []);

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
    // formik.setFieldValue(keyToSet, imageData);
  };
  return (
    <View style={styles.inputContainer}>
      <View style={styles.separatorHeading}>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.3}
        />
        <Text style={[styles.title, {color: Colors().pending}]}>
          {`Bill detail`}
        </Text>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.3}
        />
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {item?.request_stock_images.map((itm, idx) => (
          <>
            <View key={idx} style={{flexDirection: 'row'}}>
              {itm.item_image && (
                <View style={{marginRight: 10}}>
                  {/* Add margin for spacing between items */}
                  <View style={styles.crossIcon}>
                    <Icon
                      name="close"
                      color={Colors().lightShadow}
                      type={IconType.AntDesign}
                      size={15}
                      onPress={() =>
                        formik.setFieldValue(
                          `request_stock_by_user.${index}.request_stock_images`,
                          formik.values.request_stock_by_user[
                            index
                          ].request_stock_images.filter((_, i) => i !== idx),
                        )
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      setImageModalVisible(true);
                      formik.setFieldValue(
                        `request_stock_by_user.${index}.new_request_stock.${idx}.view_status`,
                        true,
                      );
                      setImageUri(
                        edit_id && itm?.item_image.startsWith('/')
                          ? `${apiBaseUrl}${itm?.item_image}`
                          : `${itm?.item_image}`,
                      );
                    }}>
                    <Image
                      source={{
                        uri:
                          edit_id && itm?.item_image.startsWith('/')
                            ? `${apiBaseUrl}${itm?.item_image}`
                            : `${itm?.item_image}`,
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
          </>
        ))}
      </ScrollView>

      {type != 'approve' && (
        <>
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
                onPress={() => setVisible(true)}
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
          {formik.values.request_stock_by_user[index].request_stock_images
            .length <= 0 && (
            <Text
              style={[
                styles.errorMesage,
                {alignSelf: 'center'},
              ]}>{`Bill is required`}</Text>
          )}
        </>
      )}

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
                  {(!billTitle || !billImage) && (
                    <Text
                      style={
                        styles.errorMesage
                      }>{`Image and title is required`}</Text>
                  )}
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
                    disabled={!billTitle || !billImage}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => {
                      formik.setFieldValue(
                        `request_stock_by_user.${index}.request_stock_images`,
                        [
                          ...formik.values.request_stock_by_user[index]
                            .request_stock_images,
                          {item_image: billImage, title: billTitle},
                        ],
                      );
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

export default BillComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
  },
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
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

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
    right: -2,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

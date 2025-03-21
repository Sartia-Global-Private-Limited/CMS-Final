import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  requestCameraWithPermission,
  requestDocumentWithPermission,
  requestGalleryWithPermission,
} from './PickerHelper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import {Icon} from '@rneui/themed';
import IconType from '../constants/IconType';

const Fileupploader = ({
  btnRef,
  cameraOption,
  cameraResponse,
  galleryOption,
  galleryResponse,
  documentOption,
  documentResponse,
}) => {
  const onPressItem = async (_, index) => {
    setTimeout(async () => {
      if (index === 0) {
        const response = await requestDocumentWithPermission(documentOption);
        documentResponse(response);
      }
      if (index === 1) {
        const response = await requestGalleryWithPermission(galleryOption);
        galleryResponse(response);
      }
      if (index === 2) {
        const response = await requestCameraWithPermission(cameraOption);
        cameraResponse(response);
      }
    }, 1000);
  };

  return (
    <RBSheet
      ref={btnRef}
      height={WINDOW_HEIGHT * 0.2}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          backgroundColor: Colors().purple,
        },
        container: {
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,
          backgroundColor: Colors().screenBackground,
          padding: 10,
          borderColor: Colors().purple,
          borderWidth: 0.8,
          alignSelf: 'center',
          width: WINDOW_WIDTH * 0.98,
        },
      }}>
      <View style={styles.mainView}>
        {documentOption && (
          <View style={styles.roundView}>
            <TouchableOpacity
              onPress={() => onPressItem('_', 0)}
              style={[styles.button, {backgroundColor: Colors().darkShadow}]}>
              <Icon
                name="file-document"
                type={IconType.MaterialCommunityIcons}
                size={50}
                color={Colors().orange}
              />
            </TouchableOpacity>
            <Text style={[styles.buttonText, {color: Colors().pureBlack}]}>
              {' '}
              Document
            </Text>
          </View>
        )}
        {galleryOption && (
          <View style={styles.roundView}>
            <TouchableOpacity
              onPress={() => onPressItem('_', 1)}
              style={[styles.button, {backgroundColor: Colors().darkShadow}]}>
              <Icon
                name="photo-library"
                type={IconType.MaterialIcons}
                size={50}
                color={Colors().red}
              />
            </TouchableOpacity>
            <Text style={[styles.buttonText, {color: Colors().pureBlack}]}>
              Gallery
            </Text>
          </View>
        )}

        {cameraOption && (
          <View style={styles.roundView}>
            <TouchableOpacity
              onPress={() => onPressItem('_', 2)}
              style={[styles.button, {backgroundColor: Colors().darkShadow}]}>
              <Icon
                name="camera"
                type={IconType.MaterialCommunityIcons}
                size={50}
                color={Colors().aprroved}
              />
            </TouchableOpacity>
            <Text style={[styles.buttonText, {color: Colors().pureBlack}]}>
              Camera
            </Text>
          </View>
        )}
      </View>
    </RBSheet>
  );
};

const styles = {
  button: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  roundView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
};

export default Fileupploader;

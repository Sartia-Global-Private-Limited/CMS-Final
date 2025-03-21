import {StyleSheet, View, Modal, Image} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import NeumorphCard from './NeumorphCard';
import {Icon} from '@rneui/base';
import IconType from '../constants/IconType';
import Dowloader from '../utils/Dowloader';

const ImageViewer = ({
  imageUri,
  visible,
  cancelBtnPress,
  downloadBtnPress,
  uniqueId,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.actionView}>
            <NeumorphCard
              lightShadowColor={Colors().darkShadow2}
              darkShadowColor={Colors().lightShadow}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="cancel-presentation"
                  type={IconType.MaterialIcons}
                  color={Colors().red}
                  onPress={() => {
                    cancelBtnPress();
                  }}
                  style={styles.actionIcon}
                />
                {downloadBtnPress && (
                  <Icon
                    name="download"
                    type={IconType.AntDesign}
                    color={Colors().aprroved}
                    onPress={() =>
                      uniqueId
                        ? Dowloader(imageUri, uniqueId)
                        : Dowloader(imageUri)
                    }
                    style={styles.actionIcon}
                  />
                )}
              </View>
            </NeumorphCard>
          </View>

          <View style={styles.Image}>
            <Image
              resizeMode="contain"
              source={{
                uri: imageUri,
              }}
              style={{height: '100%', width: '100%'}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: 'yellow',
  },
  modalView: {
    position: 'relative',
    backgroundColor: Colors().screenBackground,

    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.3,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView: {
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    right: '0%',
    top: '45%',
  },
});

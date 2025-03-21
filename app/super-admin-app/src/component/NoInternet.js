/*    ----------------Created Date :: 29- April -2024   ----------------- */

import {
  StyleSheet,
  Alert,
  BackHandler,
  Linking,
  Modal,
  View,
  Text,
} from 'react-native';
import NeumorphicButton from './NeumorphicButton';
import {WINDOW_WIDTH} from '../utils/ScreenLayout';
import Colors from '../constants/Colors';
import {useState} from 'react';
import IconType from '../constants/IconType';
import {Icon} from '@rneui/themed';

const NoInternet = () => {
  const [visible, setVisible] = useState(true);
  const handleGoToSettings = () => {
    // Open device settings here (platform-specific)
    Linking.sendIntent('android.settings.SETTINGS');
  };

  const handleExitApp = () => {
    // Exit the app (platform-specific)
    BackHandler.exitApp();
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          //   setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon
              name={'access-point-network-off'}
              type={IconType.MaterialCommunityIcons}
              size={60}
              color={Colors().red}
            />
            <Text style={[styles.modalText, styles.cardHeadingTxt]}>
              {
                'No Internet Connection Please check your internet connection and try again.'
              }
            </Text>

            <View
              style={{
                flexDirection: 'row',
                columnGap: 50,
              }}>
              <NeumorphicButton
                title={'setting'}
                titleColor={Colors().red}
                btnRadius={10}
                btnWidth={WINDOW_WIDTH * 0.3}
                onPress={handleGoToSettings}
              />

              <NeumorphicButton
                title={'Reload'}
                titleColor={Colors().aprroved}
                btnRadius={10}
                btnWidth={WINDOW_WIDTH * 0.3}
                onPress={handleExitApp}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors().screenBackground,
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    maxWidth: '65%',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  input: {
    color: Colors().text2,
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

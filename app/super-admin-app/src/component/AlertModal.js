import {StyleSheet, Text, View, Modal} from 'react-native';
import React, {useState} from 'react';
import NeumorphicButton from './NeumorphicButton';
import {Icon} from '@rneui/base';
import Colors from '../constants/Colors';
import {WINDOW_WIDTH} from '../utils/ScreenLayout';
import NeumorphicTextInput from './NeumorphicTextInput';
import NeumorphDatePicker from './NeumorphDatePicker';
import moment from 'moment';
import ScreensLabel from '../constants/ScreensLabel';

const AlertModal = ({
  visible,
  iconName,
  iconColor,
  icontype,
  textToShow,
  cancelBtnPress,
  ConfirmBtnPress,
  remarkText,
  onRemarkChange,
  onDateChange,
  errorMesage,
  Component,
  isLoading = false,
}) => {
  const label = ScreensLabel();
  const [openFromDate, setOpenFromDate] = useState(false);
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
          <View
            style={[
              styles.modalView,
              {backgroundColor: Colors().screenBackground},
            ]}>
            <Icon name={iconName} type={icontype} size={80} color={iconColor} />
            <Text
              style={[
                styles.modalText,
                styles.cardHeadingTxt,
                {color: Colors().pureBlack},
              ]}>
              {textToShow}
            </Text>
            {Component && Component}
            {onRemarkChange && (
              <View style={{rowGap: 8, marginBottom: 10}}>
                <NeumorphicTextInput
                  placeholder={'REMARK'}
                  placeHolderTxtColor={Colors().text2}
                  style={[styles.input, {color: Colors().text2}]}
                  value={remarkText}
                  onChangeText={onRemarkChange}
                />
                {errorMesage && (
                  <Text style={styles.errorMesage}>{errorMesage}</Text>
                )}
              </View>
            )}
            {onDateChange && (
              <View style={{rowGap: 8, marginBottom: 10}}>
                <NeumorphDatePicker
                  iconPress={() => setOpenFromDate(!openFromDate)}
                  valueOfDate={
                    remarkText && moment(remarkText).format('DD-MM-YYYY')
                  }
                  modal
                  open={openFromDate}
                  date={new Date()}
                  mode="date"
                  onConfirm={date => {
                    onDateChange(date);

                    setOpenFromDate(false);
                  }}
                  onCancel={() => {
                    setOpenFromDate(false);
                  }}></NeumorphDatePicker>
                {errorMesage && (
                  <Text style={styles.errorMesage}>{errorMesage}</Text>
                )}
              </View>
            )}

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
                onPress={() => cancelBtnPress()}
              />

              <NeumorphicButton
                loading={isLoading}
                title={label.CONFIRM}
                titleColor={Colors().aprroved}
                btnRadius={10}
                btnWidth={WINDOW_WIDTH * 0.3}
                onPress={() => ConfirmBtnPress()}
                disabled={errorMesage ? true : false}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,

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
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  input: {
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

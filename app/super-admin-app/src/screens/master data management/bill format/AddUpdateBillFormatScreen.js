/*    ----------------Created Date :: 8- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addBillNoFormatSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {getAllFinacialYearList} from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import {
  addBillFormat,
  updateBillFormat,
} from '../../../redux/slices/master-data-management/bill-format/addUpdateBillFormatSlice';
import {getBillFormatDetailById} from '../../../redux/slices/master-data-management/bill-format/getBillFormatDetailSlice';

const AddUpdateBillFormatScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allFY, setAllFY] = useState([]);
  const [allSymbol, setAllSymbol] = useState([]);
  const [fyFormat, setFyFormat] = useState([]);
  const [symbolText, setSymbolText] = useState('');
  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetchAllFinaceYear();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      prefix: edit?.prefix || '',
      financial_year_format: edit?.financial_year_format || '',
      start_bill_number: edit?.start_bill_number || '',
      financial_year: edit?.financial_year || '',
      separation_symbol: edit?.separation_symbol || '',
    },
    validationSchema: addBillNoFormatSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqBody = {
      prefix: values.prefix,
      financial_year_format: values.financial_year_format,
      start_bill_number: values.start_bill_number,
      financial_year: values.financial_year,
      separation_symbol: values.separation_symbol,
    };

    if (edit_id) {
      reqBody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateBillFormat(reqBody)).unwrap()
        : await dispatch(addBillFormat(reqBody)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        resetForm();
        navigation.navigate('BillFormatListScreen');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getBillFormatDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
      getFYFormat(fetchResult.data?.financial_year);

      setAllSymbol([
        {
          label: fetchResult.data?.separation_symbol,
          value: fetchResult.data?.separation_symbol,
        },
      ]);
    } else {
      setEdit([]);
    }
  };

  /* function for fetching all finance year*/
  const fetchAllFinaceYear = async () => {
    const res = await dispatch(getAllFinacialYearList({search: ''})).unwrap();

    if (res?.status) {
      const rData = res?.data.map(item => {
        return {
          label: item?.year_name,
          value: item?.year_name,
        };
      });
      setAllFY(rData);
    } else {
      setAllFY([]);
    }
  };

  const getFYFormat = year => {
    const finacialYear = year;

    const [startYear, endYear] = finacialYear.split('-');
    const format1 = `${startYear}-${startYear?.slice(0, 2)}${endYear}`;
    const format2 = `${startYear}-${endYear?.slice(-2)}`;
    const format3 = `${startYear}${startYear?.slice(0, 2)}${endYear}`;
    const format4 = `${startYear?.slice(-2)}${endYear?.slice(-2)}`;
    const financialYearFormat = [format1, format2, format3, format4];

    const rData = financialYearFormat.map(item => {
      return {
        label: item,
        value: item,
      };
    });

    setFyFormat(rData);
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text numberOfLines={1} style={[styles.inputText, {marginLeft: 10}]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={edit_id ? 'update Bill Format' : 'Add Bill Format'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>prefix </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              width={WINDOW_WIDTH * 0.9}
              value={formik?.values?.prefix}
              onChangeText={formik.handleChange('prefix')}
              style={styles.inputText}
            />
          </View>
          {formik?.touched?.prefix && formik?.errors?.prefix && (
            <Text style={styles.errorMesage}>{formik?.errors?.prefix}</Text>
          )}

          <View style={styles.twoItemView}>
            <>
              <View style={styles.leftView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>Finacial year </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>
                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.44}
                  RightIconName="caretdown"
                  RightIconType={IconType.AntDesign}
                  RightIconColor={Colors().darkShadow2}
                  placeholder={'SELECT ...'}
                  data={allFY}
                  labelField={'label'}
                  valueField={'value'}
                  value={formik?.values?.financial_year}
                  renderItem={renderDropDown}
                  search={false}
                  placeholderStyle={styles.inputText}
                  selectedTextStyle={styles.selectedTextStyle}
                  editable={false}
                  style={styles.inputText}
                  onChange={val => {
                    formik.setFieldValue(`financial_year`, val.value);

                    getFYFormat(val.value);
                  }}
                />
                {formik?.touched?.financial_year &&
                  formik?.errors?.financial_year && (
                    <Text style={styles.errorMesage}>
                      {formik?.errors?.financial_year}
                    </Text>
                  )}
              </View>
              <View style={styles.rightView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>YEar format </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>
                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.44}
                  RightIconName="caretdown"
                  RightIconType={IconType.AntDesign}
                  RightIconColor={Colors().darkShadow2}
                  placeholder={'SELECT ...'}
                  data={fyFormat}
                  labelField={'label'}
                  valueField={'value'}
                  value={formik?.values?.financial_year_format}
                  renderItem={renderDropDown}
                  search={false}
                  placeholderStyle={styles.inputText}
                  selectedTextStyle={styles.selectedTextStyle}
                  editable={false}
                  style={styles.inputText}
                  onChange={val => {
                    formik.setFieldValue(`financial_year_format`, val.value);
                  }}
                />
                {formik?.touched?.financial_year_format &&
                  formik?.errors?.financial_year_format && (
                    <Text style={styles.errorMesage}>
                      {formik?.errors?.financial_year_format}
                    </Text>
                  )}
              </View>
            </>
          </View>

          <View style={{rowGap: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>START BILL NUMBER </Text>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>

            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              width={WINDOW_WIDTH * 0.9}
              value={formik?.values?.start_bill_number}
              onChangeText={formik.handleChange('start_bill_number')}
              style={styles.inputText}
              keyboardType={'numeric'}
            />
          </View>
          {formik?.touched?.start_bill_number &&
            formik?.errors?.start_bill_number && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.start_bill_number}
              </Text>
            )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>Symbol separtion </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            RightIconName="caretdown"
            RightIconType={IconType.AntDesign}
            RightIconColor={Colors().darkShadow2}
            placeholder={'SELECT ...'}
            data={allSymbol}
            labelField={'label'}
            valueField={'value'}
            value={formik?.values?.separation_symbol}
            renderItem={renderDropDown}
            placeholderStyle={styles.inputText}
            editable={false}
            selectedTextStyle={styles.selectedTextStyle}
            style={styles.inputText}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={styles.inputSearchStyle}
            renderInputSearch={() => (
              <>
                <View style={styles.createSkillView}>
                  <TextInput
                    placeholder="ADD NEW SYMBOL"
                    style={[
                      styles.inputText,
                      {
                        // backgroundColor: 'red',
                        width: WINDOW_WIDTH * 0.7,
                      },
                    ]}
                    onChangeText={text => {
                      setSymbolText(text);
                    }}></TextInput>
                  <Icon
                    name="Safety"
                    type={IconType.AntDesign}
                    onPress={() => {
                      allSymbol.push({
                        label: symbolText,
                        value: symbolText,
                      });
                    }}
                  />
                </View>
              </>
            )}
            onChange={val => {
              formik.setFieldValue(`separation_symbol`, val.value);
            }}
          />
          {formik?.touched?.separation_symbol &&
            formik?.errors?.separation_symbol && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.separation_symbol}
              </Text>
            )}

          {/* modal view for delete*/}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => formik.handleSubmit()}
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit_id ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={() => {
                edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateBillFormatScreen;

const styles = StyleSheet.create({
  inputContainer: {
    // backgroundColor: 'green',
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
    // justifyContent: 'flex-end',
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  createSkillView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
  },

  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
});

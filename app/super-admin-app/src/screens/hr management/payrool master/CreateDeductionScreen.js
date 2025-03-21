/*    ----------------Created Date :: 2- Feb -2024    ----------------- */
import {SafeAreaView, StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {useFormik} from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {MultiSelect} from 'react-native-element-dropdown';
import {ListItem} from '@rneui/base';
import {useDispatch} from 'react-redux';
import {getAllRoles, getAllUsers} from '../../../redux/slices/commonApi';
import {CheckBox, Icon} from '@rneui/themed';
import {createDeduction} from '../../../redux/slices/hr-management/payroll-master/addUpdateDeductionSlice';
import Toast from 'react-native-toast-message';
import DropDownItem from '../../../component/DropDownItem';
import {store} from '../../../redux/store';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const CreateDeductionScreen = ({route}) => {
  const edit_id = route?.params?.edit_id;
  const {isDarkMode} = store.getState().getDarkMode;
  const [allRoles, setAllRoles] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchRolesData();
    fetchAllUser();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      deduction: [
        {
          name: 'Provident Fund',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: 'Employees State Insurance Corporation',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: 'Professional Tax',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: 'Labor Welfare Fund',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: 'National Pension Scheme',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: 'Advance Salary Deductions',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
        {
          name: '' || 'Others',
          applied_type: '',
          applied_on: '',
          value_type: '',
          by_employee: '',
          by_employer: '',
        },
      ],
    },

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = values.deduction.map(itm => {
      if (typeof itm.applied_on === 'object') {
        return {
          ...itm,
          applied_on: itm.applied_on.map(item => item).join(','),
          value_type:
            typeof itm.value_type === 'object'
              ? itm.value_type.value
              : itm.value_type,
        };
      } else {
        return {
          ...itm,
          value_type:
            typeof itm.value_type === 'object'
              ? itm.value_type.value
              : itm.value_type,
        };
      }
    });

    try {
      if (edit_id) {
        // setUpdateModalVisible(true);
        // setConfrim(formData);
      } else {
        setLoading(true);
        const createAllowanceResult = await dispatch(
          createDeduction(sData),
        ).unwrap();

        if (createAllowanceResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: createAllowanceResult?.message,
            position: 'bottom',
          });

          resetForm();
        } else {
          Toast.show({
            type: 'error',
            text1: createAllowanceResult?.message,
            position: 'bottom',
          });

          setLoading(false);
        }
        resetForm();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      console.error('Error in creating deduction', error);
    }
  };

  /*function for fetching Roloes data*/
  const fetchRolesData = async () => {
    try {
      const result = await dispatch(getAllRoles()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllRoles(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllRoles([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setAllRoles([]);
    }
  };
  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));
        setAllUser(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllUser([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllUser([]);
    }
  };

  const allowanceType = [
    {value: 1, label: 'Fixed Amount'},
    {value: 2, label: 'Percentage of Basic Salary'},
  ];

  const handlePress = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <ScrollView>
        <View style={styles.inpuntContainer}>
          {formik?.values?.deduction.map((item, index) => (
            <ListItem.Accordion
              containerStyle={{
                backgroundColor: isDarkMode
                  ? Colors().cardBackground
                  : Colors().inputDarkShadow,
                borderRadius: 8,
              }}
              theme={{colors: {background: Colors().red}}}
              icon={
                <Icon
                  name="down"
                  type={IconType.AntDesign}
                  size={20}
                  color={Colors().pureBlack}></Icon>
              }
              content={
                <>
                  <ListItem.Content style={{}}>
                    <ListItem.Title
                      style={[styles.title, {color: Colors().purple}]}>
                      {item?.name}
                    </ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={index === openIndex}
              onPress={() => {
                handlePress(index);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <CheckBox
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                    maxWidth: '30%',
                    padding: 0,
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={'Employee-Wise'}
                  textStyle={{
                    color: Colors().pureBlack,
                    fontFamily: Colors().fontFamilyBookMan,
                    fontWeight: '500',
                  }}
                  checked={formik?.values?.deduction[index].applied_type === 1}
                  onPress={() => {
                    formik.setFieldValue(`deduction.${index}.applied_type`, 1);
                    formik.setFieldValue(`deduction.${index}.applied_on`, '');
                  }}
                  checkedColor={Colors().aprroved}
                />
                <CheckBox
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                    maxWidth: '37%',
                    marginLeft: '20%',
                    padding: 0,
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={'Designation-Wise'}
                  textStyle={{
                    color: Colors().pureBlack,
                    fontFamily: Colors().fontFamilyBookMan,
                    fontWeight: '500',
                  }}
                  checked={formik?.values?.deduction[index].applied_type === 2}
                  onPress={() => {
                    formik.setFieldValue(`deduction.${index}.applied_type`, 2);
                    formik.setFieldValue(`deduction.${index}.applied_on`, '');
                  }}
                  checkedColor={Colors().aprroved}
                />
              </View>
              {formik?.values?.allowance[index].applied_type === 1 && (
                <View style={{rowGap: 8}}>
                  <MultiSelectComponent
                    title={'Employees'}
                    labelField="label"
                    valueField="value"
                    placeHolderTxt={`Select Employee...`}
                    data={allUser}
                    value={formik?.values?.allowance[index].applied_on}
                    onChange={item => {
                      formik.setFieldValue(
                        `allowance.${index}.applied_on`,
                        item,
                      );
                    }}
                  />
                </View>
              )}
              {formik?.values?.allowance[index].applied_type === 2 && (
                <View style={{rowGap: 8}}>
                  <MultiSelectComponent
                    title={'Designation'}
                    labelField="label"
                    valueField="value"
                    placeHolderTxt={`Select designation...`}
                    data={allRoles}
                    value={formik?.values?.allowance[index].applied_on}
                    onChange={item => {
                      formik.setFieldValue(
                        `allowance.${index}.applied_on`,
                        item,
                      );
                    }}
                  />
                </View>
              )}
              <View style={{rowGap: 8, marginTop: 10}}>
                <NeumorphicDropDownList
                  width={WINDOW_WIDTH * 0.9}
                  title={'deduction type'}
                  data={allowanceType}
                  value={formik?.values?.deduction[index].value_type}
                  onChange={val => {
                    formik.setFieldValue(
                      `deduction.${index}.value_type`,
                      val.value,
                    );
                  }}
                />
              </View>
              <View style={[styles.twoItemView, {marginTop: 10}]}>
                <View style={styles.leftView}>
                  <NeumorphicTextInput
                    width={WINDOW_WIDTH * 0.43}
                    title={'By employee'}
                    value={formik?.values?.deduction[index].by_employee}
                    keyboardType="number-pad"
                    onChangeText={formik.handleChange(
                      `deduction.${index}.by_employee`,
                    )}
                  />
                </View>
                <View style={styles.rightView}>
                  <NeumorphicTextInput
                    width={WINDOW_WIDTH * 0.43}
                    title={'BY EMPLOYER'}
                    value={formik?.values?.deduction[index].by_employer}
                    keyboardType="number-pad"
                    onChangeText={formik.handleChange(
                      `deduction.${index}.by_employer`,
                    )}
                  />
                </View>
              </View>
              {index == 6 && (
                <View style={{rowGap: 8, marginTop: 10}}>
                  <NeumorphicTextInput
                    width={WINDOW_WIDTH * 0.9}
                    title={'ALLOWANCE NAME'}
                    value={formik?.values?.deduction[index].name}
                    // keyboardType="number-pad"
                    onChangeText={formik.handleChange(
                      `deduction.${index}.name`,
                    )}
                  />
                </View>
              )}
            </ListItem.Accordion>
          ))}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDeductionScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  rightView: {
    flexDirection: 'column',
    // flex: 1,

    rowGap: 8,
    justifyContent: 'flex-end',
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    // columnGap: 5,
  },

  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});

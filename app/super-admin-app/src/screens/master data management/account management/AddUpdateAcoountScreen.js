/*    ----------------Created Date :: 11- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addAccountManagementSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {getAllBank} from '../../../redux/slices/commonApi';
import NeumorphCard from '../../../component/NeumorphCard';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {
  addAccountDetail,
  updateAccountDetail,
} from '../../../redux/slices/master-data-management/account-mangement/addUpdateAccountSlice';
import {getAccountDetailById} from '../../../redux/slices/master-data-management/account-mangement/getAccountDetailSlice';

const AddUpdateAcoountScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allBank, setAllBank] = useState([]);
  const [edit, setEdit] = useState({});

  const accountType = [
    {label: 'savings', value: 'savings'},
    {label: 'current', value: 'current'},
  ];

  useEffect(() => {
    fetchAllBank();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      banks: [
        {
          bank_id: edit?.bank_id || '',
          accounts: edit?.accounts || [
            {
              account_number: '',
              account_holder_name: '',
              account_type: '',
              ifsc_code: '',
              branch: '',
              is_default: true,
            },
          ],
        },
      ],
    },
    validationSchema: addAccountManagementSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    let sData;
    if (edit_id) {
      const updateReqBody = {
        id: edit_id,
        bank_id: values.banks[0].bank_id,
        account_number: values.banks[0].accounts[0].account_number,
        ifsc_code: values.banks[0].accounts[0].ifsc_code,
        branch: values.banks[0].accounts[0].branch,
        is_default: values.banks[0].accounts[0].is_default,
        account_type: values.banks[0].accounts[0].account_type,
        account_holder_name: values.banks[0].accounts[0].account_holder_name,
      };

      sData = updateReqBody;
    } else {
      const reqBody = {
        banks: values.banks.map(item => ({
          bank_id: item.bank_id,
          accounts: item.accounts.map(itm => ({
            account_number: itm.account_number,
            account_holder_name: itm.account_holder_name,
            account_type: itm.account_type,
            ifsc_code: itm.ifsc_code,
            branch: itm.branch,
            is_default: itm.is_default,
          })),
        })),
      };
      sData = reqBody;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateAccountDetail(sData)).unwrap()
        : await dispatch(addAccountDetail(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        resetForm();
        navigation.navigate('AccountListScreen');
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
    const fetchResult = await dispatch(getAccountDetailById(edit_id)).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
    }
  };

  /* function for fetching all finance year*/
  const fetchAllBank = async () => {
    const res = await dispatch(getAllBank()).unwrap();

    if (res?.status) {
      const rData = res?.data.map(item => {
        return {
          label: item?.bank_name,
          value: item?.id,
          image: item?.logo,
        };
      });
      setAllBank(rData);
    } else {
      setAllBank([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.image !== undefined && (
          <NeuomorphAvatar gap={4}>
            <Avatar
              size={30}
              rounded
              source={{
                uri: item?.image
                  ? `${apiBaseUrl}${item?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
          </NeuomorphAvatar>
        )}

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
        headerTitle={edit_id ? 'update account ' : 'Add account'}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          {formik?.values?.banks.map((item, index) => (
            <>
              {!edit_id && (
                <View style={styles.separatorHeading}>
                  <SeparatorComponent
                    separatorColor={Colors().aprroved}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.35}
                  />
                  <Text style={[styles.title, {color: Colors().aprroved}]}>
                    {index >= 0 ? `Detail ${index + 1}` : `Detail`}
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().aprroved}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.35}
                  />
                </View>
              )}

              <View style={{rowGap: 8}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.title}>Bank name </Text>
                  <Icon
                    name="asterisk"
                    type={IconType.FontAwesome5}
                    size={8}
                    color={Colors().red}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <NeumorphicDropDownList
                    width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
                    RightIconName="caretdown"
                    RightIconType={IconType.AntDesign}
                    RightIconColor={Colors().darkShadow2}
                    placeholder={'select...'}
                    data={allBank}
                    labelField={'label'}
                    valueField={'value'}
                    value={item?.bank_id}
                    renderItem={renderDropDown}
                    search={false}
                    placeholderStyle={styles.inputText}
                    selectedTextStyle={styles.selectedTextStyle}
                    style={styles.inputText}
                    onChange={val => {
                      formik.setFieldValue(`banks.${index}.bank_id`, val.value);
                    }}
                  />
                  {!edit_id && (
                    <View style={{alignSelf: 'center'}}>
                      {index <= 0 && (
                        <NeumorphCard
                          lightShadowColor={Colors().darkShadow2}
                          darkShadowColor={Colors().lightShadow}>
                          <Icon
                            name="plus"
                            type={IconType.AntDesign}
                            color={Colors().aprroved}
                            style={styles.actionIcon}
                            onPress={() =>
                              formik.setFieldValue(`banks`, [
                                ...formik?.values?.banks,
                                {
                                  bank_id: '',
                                  accounts: [
                                    {
                                      account_number: '',
                                      account_holder_name: '',
                                      account_type: '',
                                      ifsc_code: '',
                                      branch: '',
                                      is_default: true,
                                    },
                                  ],
                                },
                              ])
                            }
                          />
                        </NeumorphCard>
                      )}

                      {index > 0 && (
                        <NeumorphCard
                          lightShadowColor={Colors().darkShadow2}
                          darkShadowColor={Colors().lightShadow}>
                          <Icon
                            name="minus"
                            type={IconType.AntDesign}
                            color={Colors().red}
                            style={styles.actionIcon}
                            onPress={() =>
                              formik.setFieldValue(
                                `banks`,
                                formik?.values?.banks.filter(
                                  (_, i) => i !== index,
                                ),
                              )
                            }
                          />
                        </NeumorphCard>
                      )}
                    </View>
                  )}
                </View>
              </View>
              {formik?.touched?.banks &&
                formik?.touched?.banks[index] &&
                formik?.errors?.banks &&
                formik?.errors?.banks[index]?.bank_id && (
                  <Text style={styles.errorMesage}>
                    {formik?.errors?.banks[index].bank_id}
                  </Text>
                )}

              {item.accounts.map((itm, idx) => (
                <>
                  {!edit_id && (
                    <View style={styles.separatorHeading}>
                      <SeparatorComponent
                        separatorColor={Colors().pending}
                        separatorHeight={1}
                        separatorWidth={WINDOW_WIDTH * 0.35}
                      />
                      <Text style={[styles.title, {color: Colors().pending}]}>
                        {idx >= 0 ? `Account ${idx + 1}` : `Account`}
                      </Text>
                      <SeparatorComponent
                        separatorColor={Colors().pending}
                        separatorHeight={1}
                        separatorWidth={WINDOW_WIDTH * 0.35}
                      />
                    </View>
                  )}

                  <View style={styles.twoItemView}>
                    <>
                      <View style={styles.leftView}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.title}>Account number </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.44}
                          value={itm.account_number}
                          onChangeText={formik.handleChange(
                            `banks.${index}.accounts.${idx}.account_number`,
                          )}
                          style={styles.inputText}
                          keyboardType={'numeric'}
                          maxLength={18}
                        />
                        {formik?.touched?.banks &&
                          formik?.touched?.banks[index] &&
                          formik?.errors?.banks &&
                          formik?.errors?.banks[index]?.accounts[idx] &&
                          formik?.errors?.banks[index]?.accounts[idx]
                            ?.account_number && (
                            <Text style={styles.errorMesage}>
                              {
                                formik?.errors?.banks[index]?.accounts[idx]
                                  .account_number
                              }
                            </Text>
                          )}
                      </View>
                      <View style={styles.rightView}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.title}>Ifsc code </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.44}
                          value={itm.ifsc_code}
                          onChangeText={formik.handleChange(
                            `banks.${index}.accounts.${idx}.ifsc_code`,
                          )}
                          style={styles.inputText}
                          maxLength={11}
                          // keyboardType={'numeric'}
                        />
                        {formik?.touched?.banks &&
                          formik?.touched?.banks[index] &&
                          formik?.errors?.banks &&
                          formik?.errors?.banks[index]?.accounts[idx] &&
                          formik?.errors?.banks[index]?.accounts[idx]
                            .ifsc_code && (
                            <Text style={styles.errorMesage}>
                              {
                                formik?.errors?.banks[index]?.accounts[idx]
                                  .ifsc_code
                              }
                            </Text>
                          )}
                      </View>
                    </>
                  </View>

                  <View style={{rowGap: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.title}>Account type </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>

                    <NeumorphicDropDownList
                      width={WINDOW_WIDTH * 0.9}
                      RightIconName="caretdown"
                      RightIconType={IconType.AntDesign}
                      RightIconColor={Colors().darkShadow2}
                      placeholder={'select...'}
                      data={accountType}
                      labelField={'label'}
                      valueField={'value'}
                      value={itm.account_type}
                      renderItem={renderDropDown}
                      search={false}
                      placeholderStyle={styles.inputText}
                      selectedTextStyle={styles.selectedTextStyle}
                      style={styles.inputText}
                      onChange={val => {
                        formik.setFieldValue(
                          `banks.${index}.accounts.${idx}.account_type`,
                          val.value,
                        );
                      }}
                    />
                  </View>
                  {formik?.touched?.banks &&
                    formik?.touched?.banks[index] &&
                    formik?.errors?.banks &&
                    formik?.errors?.banks[index]?.accounts[idx] &&
                    formik?.errors?.banks[index]?.accounts[idx]
                      .account_type && (
                      <Text style={styles.errorMesage}>
                        {
                          formik?.errors?.banks[index]?.accounts[idx]
                            .account_type
                        }
                      </Text>
                    )}

                  <View style={{rowGap: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.title}>Account holder name </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>

                    <NeumorphicTextInput
                      placeHolderTxt={'TYPE...'}
                      width={WINDOW_WIDTH * 0.9}
                      value={itm.account_holder_name}
                      onChangeText={formik.handleChange(
                        `banks.${index}.accounts.${idx}.account_holder_name`,
                      )}
                      style={styles.inputText}
                      // keyboardType={'numeric'}
                    />
                  </View>
                  {formik?.touched?.banks &&
                    formik?.touched?.banks[index] &&
                    formik?.errors?.banks &&
                    formik?.errors?.banks[index]?.accounts[idx] &&
                    formik?.errors?.banks[index]?.accounts[idx]
                      .account_holder_name && (
                      <Text style={styles.errorMesage}>
                        {
                          formik?.errors?.banks[index]?.accounts[idx]
                            .account_holder_name
                        }
                      </Text>
                    )}

                  <View style={{rowGap: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.title}>branch name </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>

                    <NeumorphicTextInput
                      placeHolderTxt={'TYPE...'}
                      width={WINDOW_WIDTH * 0.9}
                      value={itm.branch}
                      onChangeText={formik.handleChange(
                        `banks.${index}.accounts.${idx}.branch`,
                      )}
                      style={styles.inputText}
                      // keyboardType={'numeric'}
                    />
                  </View>
                  {formik?.touched?.banks &&
                    formik?.touched?.banks[index] &&
                    formik?.errors?.banks &&
                    formik?.errors?.banks[index]?.accounts[idx] &&
                    formik?.errors?.banks[index]?.accounts[idx].branch && (
                      <Text style={styles.errorMesage}>
                        {formik?.errors?.banks[index]?.accounts[idx].branch}
                      </Text>
                    )}

                  <View
                    style={[
                      styles.checkboxView,
                      {justifyContent: 'space-between'},
                    ]}>
                    <NeumorphicCheckbox
                      isChecked={itm.is_default}
                      onChange={value => {
                        formik.setFieldValue(
                          `banks.${index}.accounts.${idx}.is_default`,
                          value,
                        );

                        item.accounts.forEach((_, i) => {
                          if (i !== idx) {
                            formik.setFieldValue(
                              `banks.${index}.accounts.${i}.is_default`,
                              false,
                            );
                          }
                        });
                      }}></NeumorphicCheckbox>
                    <Text style={styles.rememberTxt}>MARK AS DEFAULT</Text>
                    {!edit_id && (
                      <View style={{alignSelf: 'center'}}>
                        {idx <= 0 && (
                          <NeumorphCard
                            lightShadowColor={Colors().darkShadow2}
                            darkShadowColor={Colors().lightShadow}>
                            <Icon
                              name="plus"
                              type={IconType.AntDesign}
                              color={Colors().aprroved}
                              style={styles.actionIcon}
                              onPress={() => {
                                formik.setFieldValue(
                                  `banks.${index}.accounts`,
                                  [
                                    ...formik?.values?.banks[index].accounts,
                                    {
                                      account_number: '',
                                      account_holder_name: '',
                                      account_type: '',
                                      ifsc_code: '',
                                      branch: '',
                                      is_default: false,
                                    },
                                  ],
                                );
                              }}
                            />
                          </NeumorphCard>
                        )}

                        {idx > 0 && (
                          <NeumorphCard
                            lightShadowColor={Colors().darkShadow2}
                            darkShadowColor={Colors().lightShadow}>
                            <Icon
                              name="minus"
                              type={IconType.AntDesign}
                              color={Colors().red}
                              style={styles.actionIcon}
                              onPress={() =>
                                formik.setFieldValue(
                                  `banks.${index}.accounts`,
                                  formik?.values?.banks[index].accounts.filter(
                                    (_, i) => i !== idx,
                                  ),
                                )
                              }
                            />
                          </NeumorphCard>
                        )}
                      </View>
                    )}
                  </View>
                </>
              ))}
            </>
          ))}

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

export default AddUpdateAcoountScreen;

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
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    flex: 1,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1%',
  },
  rememberTxt: {
    marginLeft: '2%',
    color: Colors().gray,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

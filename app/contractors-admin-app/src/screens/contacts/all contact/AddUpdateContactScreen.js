/*    ----------------Created Date :: 7 - August -2024   ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import SeparatorComponent from '../../../component/SeparatorComponent';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import { addContactsSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { Icon, ListItem } from '@rneui/base';
import { useDispatch } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import NeumorphCard from '../../../component/NeumorphCard';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import {
  getAllCompanyList,
  getAllPositionList,
} from '../../../redux/slices/commonApi';
import ScreensLabel from '../../../constants/ScreensLabel';
import { store } from '../../../redux/store';
import {
  addContact,
  updateContact,
} from '../../../redux/slices/contacts/all contact/addUpdateCompanyContactSlice';
import { getContactDetailById } from '../../../redux/slices/contacts/all contact/getCompanyContactDetailSlice';

const AddUpdateContactScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const { isDarkMode } = store.getState().getDarkMode;
  const [edit, setEdit] = useState({});
  const [allCompany, setAllCompany] = useState([]);
  const [allPosition, setAllPosition] = useState([]);
  const [loading, setLoading] = useState(false);

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [positionText, setPositionText] = useState('');
  const dispatch = useDispatch();
  const label = ScreensLabel();

  const ACTIVE_STATUS = [
    { label: 'Active', value: '1' },
    { label: 'InActive', value: '0' },
  ];

  useEffect(() => {
    fetchAllCompany();
    fetchAllPosition();

    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      company_id: edit?.company_id || '',
      position: edit?.position || '',
      first_name: edit.first_name || '',
      last_name: edit.last_name || '',
      status: edit.status || '1',
      phone: edit?.phone || [
        {
          number: '',
          primary: '1',
        },
      ],
      email: edit?.email || [
        {
          email: '',
          primary: '1',
        },
      ],
      notes: edit.notes || '',
    },
    validationSchema: addContactsSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      company_id: values.company_id,
      first_name: values.first_name,
      last_name: values.last_name,
      position: values.position,
      notes: values.notes,
      status: values.status,
      phone: values.phone,
      email: values.email,
    };

    if (edit.id) {
      sData['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateContact(sData)).unwrap()
        : await dispatch(addContact(sData)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('ContactTopTab');
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  /*function for fetching category data*/
  const fetchAllCompany = async () => {
    try {
      const result = await dispatch(getAllCompanyList()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.company_name,
          value: itm?.company_id,
        }));

        setAllCompany(rData);
      } else {
        setAllCompany([]);
      }
    } catch (error) {
      setAllCompany([]);
    }
  };
  /*function for fetching supplier data*/
  const fetchAllPosition = async () => {
    try {
      const result = await dispatch(getAllPositionList()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.position,
          value: itm?.position,
        }));

        setAllPosition(rData);
      } else {
        setAllPosition([]);
      }
    } catch (error) {
      setAllPosition([]);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getContactDetailById(edit_id)).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setEdit([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setEdit([]);
    }
  };

  const accordionData = [
    { title: 'Basic details', content: 'Content for Item 1' },
    { title: 'Phone DETAILS', content: 'Content for Item 2' },
    { title: 'Email DETAILS', content: 'Content for Item 3' },
  ];

  const handlePress = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getFormError = (errors, index) => {
    let indexArray = [];

    if (
      errors.company_id ||
      errors.first_name ||
      errors.last_name ||
      errors.position
    ) {
      indexArray.push(0);
    }
    if (errors.phone) {
      indexArray.push(1);
    }

    if (errors.email) {
      indexArray.push(2);
    }

    return indexArray;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.CONTACT} ${label.UPDATE}`
            : `${label.CONTACT} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          {accordionData.map((item, index) => (
            <ListItem.Accordion
              containerStyle={{
                backgroundColor: isDarkMode
                  ? Colors().cardBackground
                  : Colors().inputDarkShadow,
                borderRadius: 8,
              }}
              theme={{ colors: { background: Colors().red } }}
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
                      style={[styles.title, { color: Colors().purple }]}>
                      {item?.title}
                      <>
                        {getFormError(formik.errors, index).includes(index) && (
                          <Icon
                            name="error-outline"
                            type={IconType.MaterialIcons}
                            color={Colors().red}></Icon>
                        )}
                      </>
                    </ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={index === openIndex}
              onPress={() => {
                handlePress(index);
              }}>
              {/*view for basic detail*/}
              {index == 0 && (
                <ListItem.Content>
                  <View style={{ rowGap: 2 }}>
                    <NeumorphicDropDownList
                      title={'company name'}
                      required={true}
                      data={allCompany}
                      value={formik.values.company_id}
                      onChange={val => {
                        formik.setFieldValue(`company_id`, val.value);
                      }}
                      errorMessage={formik?.errors?.company_id}
                    />

                    <NeumorphicTextInput
                      title={'first name'}
                      required={true}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.first_name}
                      onChangeText={formik.handleChange('first_name')}
                      errorMessage={formik?.errors?.first_name}
                    />

                    <NeumorphicTextInput
                      title={'last name'}
                      required={true}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.last_name}
                      onChangeText={formik.handleChange('last_name')}
                      errorMessage={formik?.errors?.last_name}
                    />

                    <NeumorphicDropDownList
                      title={'position'}
                      required={true}
                      data={allPosition}
                      value={formik.values.position}
                      search
                      searchPlaceholder="Search..."
                      inputSearchStyle={styles.inputSearchStyle}
                      renderInputSearch={() => (
                        <>
                          <View style={styles.createSkillView}>
                            <TextInput
                              placeholder="CREATE"
                              style={[
                                styles.inputText,
                                {
                                  color: Colors().pureBlack,
                                  // backgroundColor: 'red',
                                  width: WINDOW_WIDTH * 0.7,
                                },
                              ]}
                              onChangeText={text => {
                                setPositionText(text);
                              }}></TextInput>
                            <Icon
                              name="Safety"
                              type={IconType.AntDesign}
                              onPress={() => {
                                allPosition.push({
                                  label: positionText,
                                  value: positionText,
                                });
                              }}
                            />
                          </View>
                        </>
                      )}
                      onChange={val => {
                        formik.setFieldValue(`position`, val.value);
                      }}
                      errorMessage={formik?.errors?.position}
                    />

                    <NeumorphicDropDownList
                      title={'status'}
                      required={true}
                      data={ACTIVE_STATUS}
                      value={formik.values.status}
                      onChange={val => {
                        formik.setFieldValue(`status`, val.value);
                      }}
                      errorMessage={formik?.errors?.status}
                    />

                    <NeumorphicTextInput
                      title={'Notes'}
                      height={WINDOW_HEIGHT * 0.09}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.notes}
                      multiline
                      onChangeText={formik.handleChange('notes')}
                    />
                  </View>
                </ListItem.Content>
              )}

              {/*view for Phone Number details*/}
              {index == 1 && (
                <>
                  {formik.values.phone.map((item1, index1) => (
                    <View key={index1}>
                      <ListItem.Content style={{ rowGap: 8 }}>
                        <View style={styles.separatorHeading}>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.23}
                          />
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            {index1 >= 0
                              ? `Phone number ${index1 + 1}`
                              : `Phone Number`}
                          </Text>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.23}
                          />

                          <View style={styles.actionView2}>
                            {index1 <= 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  name="plus"
                                  type={IconType.AntDesign}
                                  color={Colors().aprroved}
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(`phone`, [
                                      ...formik.values.phone,
                                      {
                                        number: '',
                                        primary: '0',
                                      },
                                    ])
                                  }
                                />
                              </NeumorphCard>
                            )}

                            {index1 > 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(
                                      `phone`,
                                      formik.values.phone.filter(
                                        (_, i) => i !== index1,
                                      ),
                                    )
                                  }
                                  name="minus"
                                  type={IconType.AntDesign}
                                  color={Colors().red}
                                />
                              </NeumorphCard>
                            )}
                          </View>
                        </View>

                        <NeumorphicTextInput
                          title={'Phone number'}
                          required={true}
                          width={WINDOW_WIDTH * 0.92}
                          value={item1.number}
                          keyboardType="numeric"
                          maxLength={10}
                          onChangeText={formik.handleChange(
                            `phone.${index1}.number`,
                          )}
                          errorMessage={formik?.errors?.phone?.[index1]?.number}
                        />

                        <View style={styles.checkboxView}>
                          <NeumorphicCheckbox
                            isChecked={item1.primary === '1' ? true : false}
                            onChange={value => {
                              if (value === true) {
                                formik.setFieldValue(
                                  `phone.${index1}.primary`,
                                  '1',
                                );
                              } else {
                                formik.setFieldValue(
                                  `phone.${index1}.primary`,
                                  '0',
                                );
                              }

                              formik.values.phone.forEach((_, i) => {
                                if (i !== index1) {
                                  formik.setFieldValue(
                                    `phone.${i}.primary`,
                                    '0',
                                  );
                                }
                              });
                            }}></NeumorphicCheckbox>
                          <Text
                            style={[
                              styles.rememberTxt,
                              { color: Colors().gray },
                            ]}>
                            MARK AS DEFAULT
                          </Text>
                        </View>
                      </ListItem.Content>
                    </View>
                  ))}
                </>
              )}

              {/*view for email details*/}
              {index == 2 && (
                <>
                  {formik.values.email.map((item2, index2) => (
                    <View key={index2}>
                      <ListItem.Content style={{ rowGap: 8 }}>
                        <View style={styles.separatorHeading}>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.3}
                          />
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            {index2 >= 0
                              ? `email Id ${index2 + 1}`
                              : `email id`}
                          </Text>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.3}
                          />

                          <View style={styles.actionView2}>
                            {index2 <= 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  name="plus"
                                  type={IconType.AntDesign}
                                  color={Colors().aprroved}
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(`email`, [
                                      ...formik.values.email,
                                      {
                                        email: '',
                                        primary: '0',
                                      },
                                    ])
                                  }
                                />
                              </NeumorphCard>
                            )}

                            {index2 > 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(
                                      `email`,
                                      formik.values.email.filter(
                                        (_, i) => i !== index2,
                                      ),
                                    )
                                  }
                                  name="minus"
                                  type={IconType.AntDesign}
                                  color={Colors().red}
                                />
                              </NeumorphCard>
                            )}
                          </View>
                        </View>

                        <NeumorphicTextInput
                          title={'email'}
                          required={true}
                          width={WINDOW_WIDTH * 0.92}
                          value={item2.email}
                          onChangeText={formik.handleChange(
                            `email.${index2}.email`,
                          )}
                          errorMessage={formik?.errors?.email?.[index2]?.email}
                        />

                        <View style={styles.checkboxView}>
                          <NeumorphicCheckbox
                            isChecked={item2.primary === '1' ? true : false}
                            onChange={value => {
                              if (value === true) {
                                formik.setFieldValue(
                                  `email.${index2}.primary`,
                                  '1',
                                );
                              } else {
                                formik.setFieldValue(
                                  `email.${index2}.primary`,
                                  '0',
                                );
                              }

                              formik.values.email.forEach((_, i) => {
                                if (i !== index2) {
                                  formik.setFieldValue(
                                    `email.${i}.primary`,
                                    '0',
                                  );
                                }
                              });
                            }}></NeumorphicCheckbox>
                          <Text
                            style={[
                              styles.rememberTxt,
                              { color: Colors().gray },
                            ]}>
                            MARK AS DEFAULT
                          </Text>
                        </View>
                      </ListItem.Content>
                    </View>
                  ))}
                </>
              )}

              <ListItem.Chevron />
            </ListItem.Accordion>
          ))}

          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => {
                formik.handleSubmit(), setUpdateModalVisible(false);
              }}
            />
          )}

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
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

export default AddUpdateContactScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    flex: 1,
  },

  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1%',
  },
  rememberTxt: {
    marginLeft: '2%',

    fontSize: 15,
    fontWeight: '600',
    fontFamily: Colors().fontFamilyBookMan,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  createSkillView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
  },
});

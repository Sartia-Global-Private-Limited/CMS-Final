/*    ----------------Created Date :: 12- March -2024   ----------------- */

import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar } from '@rneui/themed';
import { selectUser } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { apiBaseUrl } from '../../../../config';
import Images from '../../../constants/Images';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import BillComponent from './BillComponent';
import NewItemComponent from './NewItemComponent';
import OldItemComponent from './OldItemComponent';
import {
  getAllGstType,
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllSupplier,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import { getStockRequestDetailById } from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';

const OldAndNewItem = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allSupplier, setAllSuupplier] = useState([]);
  const [allGst, setAllGst] = useState([]);

  useEffect(() => {
    fetchAllSupplier();
    fetchAllGstType();
    fetchMangerData();
    fetchUserData();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  /* function  which covert number to string */
  const converToString = value => {
    if (typeof value == 'number') {
      return String(value);
    } else {
      return value;
    }
  };

  /*funciton for fetching the single stock detail*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getStockRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      if (fetchResult.data?.stock_request_for == 2) {
        if (fetchResult?.data?.area_manager_id?.value) {
          hadleTeamMangerChange(fetchResult?.data?.area_manager_id?.value);
        }

        if (fetchResult?.data?.supervisor_id?.value) {
          hadleSupervisorChange(fetchResult?.data?.supervisor_id?.value);
        }
      }
    } else {
      // setEdit([]);
    }
  };

  /*function for fetching supplier data*/
  const fetchAllSupplier = async () => {
    try {
      const result = await dispatch(getAllSupplier()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.supplier_name,
          value: itm?.id,
        }));

        setAllSuupplier(rData);
      } else {
        setAllSuupplier([]);
      }
    } catch (error) {
      setAllSuupplier([]);
    }
  };
  /* function for fetching gst type */
  const fetchAllGstType = async () => {
    try {
      const result = await dispatch(getAllGstType()).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.title,
          value: itm?.id,
          percentage: itm?.percentage,
        }));
        setAllGst(rData);
      } else {
        setAllGst([]);
      }
    } catch (error) {
      setAllGst([]);
    }
  };

  /*function for fetching Manger list data*/
  const fetchMangerData = async () => {
    try {
      const result = await dispatch(getAllManger()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));

        setAllManager(rData);
      } else {
        setAllManager([]);
      }
    } catch (error) {
      setAllManager([]);
    }
  };
  /*function for fetching User list data*/
  const fetchUserData = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));
        setAllOffice(rData);
      } else {
        setAllOffice([]);
      }
    } catch (error) {
      setAllOffice([]);
    }
  };

  /*function for fetching supervisor list data*/
  const hadleTeamMangerChange = async managerId => {
    setAllEndUser([]);
    try {
      const result = await dispatch(
        getAllSupervisorByMangaerId({ managerId }),
      ).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllSupervisor(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllSupervisor([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllSupervisor([]);
    }
  };
  /*function for fetching free end user list data*/
  const hadleSupervisorChange = async superVisorId => {
    try {
      const result = await dispatch(getAllFreeUserList(superVisorId)).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllEndUser(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllEndUser([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllEndUser([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
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
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={{}}>
      {formik.values.request_stock_by_user.map((item, index) => (
        <>
          <View style={styles.inputContainer}>
            <View style={{ rowGap: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {formik.values.stock_request_for == 1 && (
                  <>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={40}
                        rounded
                        source={{
                          uri: user?.image
                            ? `${apiBaseUrl}${user?.image}`
                            : `${
                                Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                  .uri
                              }`,
                        }}
                      />
                    </NeuomorphAvatar>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.title,
                        {
                          color: Colors().pureBlack,
                          alignSelf: 'center',
                          marginHorizontal: 10,
                          textAlign: 'center',
                        },
                      ]}>
                      {user?.name} ({user?.employee_id} self)
                    </Text>
                  </>
                )}

                {formik.values.request_tax_type == '2' &&
                  formik.values.stock_request_for == '2' && (
                    <>
                      <View style={styles.leftView}>
                        <NeumorphicDropDownList
                          height={WINDOW_HEIGHT * 0.06}
                          width={WINDOW_WIDTH * 0.45}
                          title={'gst type'}
                          required={true}
                          data={allGst}
                          value={item?.gst_id}
                          onChange={val => {
                            formik.setFieldValue(
                              `request_stock_by_user.${index}.gst_id`,
                              val,
                            );

                            formik.setFieldValue(
                              `request_stock_by_user.${index}.gst_percent`,
                              val?.percentage,
                            );
                          }}
                          errorMessage={
                            formik?.errors?.request_stock_by_user?.[index]
                              ?.gst_id
                          }
                        />
                      </View>
                      <View
                        style={[
                          styles.rightView,
                          { marginLeft: WINDOW_WIDTH * 0.2 },
                        ]}>
                        <NeumorphicTextInput
                          title={'gst %'}
                          width={WINDOW_WIDTH * 0.25}
                          value={converToString(item.gst_percent)}
                          editable={false}
                        />
                      </View>
                    </>
                  )}

                {/* {type != 'approve' && (
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
                            formik.setFieldValue(`request_stock_by_user`, [
                              ...formik.values.request_stock_by_user,
                              {
                                supplier_id: '',
                                area_manager_id: '',
                                supervisor_id: '',
                                office_users_id: '',
                                end_users_id: '',
                                // user_id: '',
                                gst_id: '',
                                request_stock_images: [
                                  {item_image: '', title: ''},
                                ],
                                gst_percent: '',
                                ...(type !== 'approve'
                                  ? {
                                      total_request_qty: edit.total_request_qty,
                                    }
                                  : {}),
                                new_request_stock:
                                  type == 'approve' &&
                                  edit?.approved_data?.length > 0
                                    ? edit.approved_data?.[0]?.new_request_stock
                                    : edit?.request_stock?.new_request_stock,
                                request_stock: [
                                  {
                                    item_name: '',
                                    prev_item_price: '',
                                    prev_user_stock: '',
                                    request_quantity: '',
                                    total_price: '',
                                    current_item_price: '',
                                    gst_id: '',
                                    gst_percent: '',
                                    ...(type === 'approve'
                                      ? {approve_quantity: 0}
                                      : {}),
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
                              `request_stock_by_user`,
                              formik.values.request_stock_by_user.filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                        />
                      </NeumorphCard>
                    )}
                  </View>
                )} */}
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                columnGap: 10,
              }}>
              {formik.values.stock_request_for == 2 && (
                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.75}
                  title={'office'}
                  data={allOffice}
                  value={item?.office_users_id}
                  disable={edit_id || item.area_manager_id}
                  onChange={val => {
                    formik.setFieldValue(
                      `request_stock_by_user.${index}.office_users_id`,
                      val.value,
                    );
                  }}
                />
              )}

              {formik.values.stock_request_for == 2 && (
                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.06}
                  width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
                  title={'Manager'}
                  data={allManger}
                  value={item?.area_manager_id}
                  disable={edit_id || item.office_users_id}
                  onChange={val => {
                    formik.setFieldValue(
                      `request_stock_by_user.${index}.area_manager_id`,
                      val,
                    );
                    hadleTeamMangerChange(val.value);
                  }}
                />
              )}

              {formik.values.stock_request_for == 2 && (
                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.06}
                  width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
                  title={'supervisor'}
                  data={allSupervisor}
                  value={item?.supervisor_id}
                  disable={edit_id || item.office_users_id}
                  onChange={val => {
                    formik.setFieldValue(
                      `request_stock_by_user.${index}.supervisor_id`,
                      val,
                    );
                    hadleSupervisorChange(val.value);
                  }}
                />
              )}

              {formik.values.stock_request_for == 2 && (
                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.75}
                  title={'end user'}
                  data={allEndUser}
                  value={item?.end_users_id}
                  onChange={val => {
                    formik.setFieldValue(
                      `request_stock_by_user.${index}.end_users_id`,
                      val,
                    );
                  }}
                />
              )}

              <NeumorphicDropDownList
                width={edit_id ? WINDOW_WIDTH * 0.9 : WINDOW_WIDTH * 0.75}
                title={'supplier name'}
                required={true}
                data={allSupplier}
                disable={edit_id}
                value={item?.supplier_id}
                onChange={val => {
                  formik.setFieldValue(
                    `request_stock_by_user.${index}.supplier_id`,
                    val,
                  );
                }}
                errorMessage={
                  formik?.errors?.request_stock_by_user?.[index]?.supplier_id
                }
              />

              {formik.values.request_tax_type == '2' &&
                formik.values.stock_request_for == '1' && (
                  <View style={styles.twoItemView}>
                    <>
                      <View style={styles.leftView}>
                        <NeumorphicDropDownList
                          height={WINDOW_HEIGHT * 0.06}
                          width={WINDOW_WIDTH * 0.44}
                          title={'gst type'}
                          required={true}
                          data={allGst}
                          value={item?.gst_id}
                          onChange={val => {
                            formik.setFieldValue(
                              `request_stock_by_user.${index}.gst_id`,
                              val,
                            );

                            formik.setFieldValue(
                              `request_stock_by_user.${index}.gst_percent`,
                              val.percentage,
                            );
                          }}
                          errorMessage={
                            formik?.errors?.request_stock_by_user?.[index]
                              ?.gst_id
                          }
                        />
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphicTextInput
                          title={'gst %'}
                          width={WINDOW_WIDTH * 0.44}
                          value={converToString(item.gst_percent)}
                          editable={false}
                        />
                      </View>
                    </>
                  </View>
                )}
            </ScrollView>
          </View>

          {/* custome ui for old stock item */}
          {
            <OldItemComponent
              item={item}
              index={index}
              formik={formik}
              type={type}
              edit_id={edit_id}
              edit={edit}
            />
          }

          {/* custome ui for new stock item */}
          {
            <NewItemComponent
              item={item}
              index={index}
              formik={formik}
              type={type}
              edit_id={edit_id}
              edit={edit}
            />
          }

          {/* custome ui for Bill adding */}
          {
            <BillComponent
              item={item}
              index={index}
              formik={formik}
              type={type}
              edit_id={edit_id}
              edit={edit}
            />
          }
        </>
      ))}
    </View>
  );
};

export default OldAndNewItem;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    rowGap: 10,
  },
  inputText: {
    fontSize: 13,
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
    margin: 3,
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

  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },
});

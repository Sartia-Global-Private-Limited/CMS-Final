/*    ----------------Created Date :: 18- April -2024   ----------------- */

import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import IconType from '../../../constants/IconType';
import {useDispatch, useSelector} from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import {Avatar, Badge} from '@rneui/themed';
import Colors from '../../../constants/Colors';
import {Icon} from '@rneui/base';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import {
  getApproveItemPriceByUserId,
  getFundItemListByUserId,
} from '../../../redux/slices/commonApi';
import {selectUser} from '../../../redux/slices/authSlice';
import CustomeCard from '../../../component/CustomeCard';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import {Dropdown} from 'react-native-element-dropdown';

const ExpenseItemComponent = ({formik, type, edit}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    fetchItemData();
  }, [
    formik.values.end_users_id,
    formik.values.supervisor_id,
    formik.values.area_manager_id,
    formik.values.expense_punch_for,
  ]);

  /const for pay method/;
  const payMethod = [
    {label: 'UPI', value: 'upi'},
    {
      label: 'Net Banking',
      value: 'net_banking',
    },
  ];

  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(
        getFundItemListByUserId(
          formik.values.expense_punch_for == 1
            ? user.id
            : formik.values.end_users_id ||
                formik.values.supervisor_id ||
                formik.values.area_manager_id,
        ),
      ).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.item_name,
          value: itm?.item_id,
          image: itm?.item_image,
        }));

        setAllItem(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setAllItem([]);
    }
  };

  const onIncreDecre = ({returnValue, formik, keyToSet}) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the middle value

    multipliedPrice(
      returnValue,
      type == 'approve'
        ? formik.values.items[index]?.item_price
        : formik.values.items[index]?.price, //fixed value
      `items.${index}.sub_total`,
      formik.setFieldValue,
    );
  };

  /*function for fetching item  stock detail*/
  const handleItemChange = async (itemId, index, item_image) => {
    const userId =
      formik?.values.expense_punch_for == 1
        ? user.id
        : formik.values.end_users_id ||
          formik.values.supervisor_id ||
          formik.values.area_manager_id;
    try {
      const result = await dispatch(
        getApproveItemPriceByUserId({itemId, userId}),
      ).unwrap();

      if (result.status) {
        formik.setFieldValue(
          `items.${index}.item_id`,
          result?.data[0]?.item_id,
        );
        formik.setFieldValue(
          `items.${index}.fund_id`,
          result?.data[0]?.fund_id,
        );
        formik.setFieldValue(
          `items.${index}.remaining_qty`,
          result?.data[0]?.remaining_quantity,
        );
        formik.setFieldValue(
          `items.${index}.price`,
          result?.data[0]?.item_price,
        );
        formik.setFieldValue(`items.${index}.item_image`, item_image);
      }
    } catch (error) {}
  };

  /* function  which covert number to string */
  const converToString = value => {
    if (typeof value == 'number') {
      return String(value);
    } else {
      return value;
    }
  };
  /* function  which covert number to string */
  const converToNumber = value => {
    if (typeof value == 'string') {
      return Number(value);
    } else {
      return value;
    }
  };

  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };
  /*function for total price based on rate and qty*/
  const multipliedPrice = (
    changeAblevalue, //this the value which
    fixedValue,
    assignKey,
    setFormikValues,
  ) => {
    const total = changeAblevalue * fixedValue;
    setFormikValues(assignKey, parseFloat(isNaN(total) ? 0 : total));
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[styles.listView, {backgroundColor: Colors().inputLightShadow}]}>
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
              {marginLeft: 10, color: Colors().pureBlack},
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View>
      {formik?.values?.items.map((itm, idx) => {
        return (
          <View>
            {type != 'approve' && (
              <View style={styles.crossIcon}>
                <Icon
                  name="close"
                  type={IconType.AntDesign}
                  color={Colors().pureBlack}
                  size={12}
                  onPress={() =>
                    formik.setFieldValue(
                      `items`,
                      formik.values.items.filter((_, i) => i !== idx),
                    )
                  }
                />
              </View>
            )}

            <CustomeCard
              avatarImage={
                type == 'approve' ? itm?.item_images : itm?.item_image
              }
              data={[
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        item name :{' '}
                      </Text>

                      <View style={{flex: 1}}>
                        <Dropdown
                          data={allItem}
                          placeholder={
                            type == 'approve' ? itm?.item_name : 'select...'
                          }
                          labelField={'label'}
                          valueField={'value'}
                          value={itm?.item_id}
                          renderItem={renderDropDown}
                          search={false}
                          disable={type == 'approve'}
                          placeholderStyle={[
                            styles.inputText,
                            {color: Colors().pureBlack},
                          ]}
                          selectedTextStyle={[
                            styles.selectedTextStyle,
                            {color: Colors().pureBlack},
                          ]}
                          style={[
                            styles.inputText,
                            {color: Colors().pureBlack},
                          ]}
                          containerStyle={{
                            backgroundColor: Colors().inputLightShadow,
                          }}
                          onChange={val => {
                            handleItemChange(val.value, idx, val?.image);
                            formik.setFieldValue(
                              type == 'approve'
                                ? `items.${idx}.approve_qty`
                                : `items.${idx}.qty`,
                              '',
                            );
                            formik.setFieldValue(`items.${idx}.sub_total`, '');
                          }}
                        />
                      </View>
                      {!itm?.item_id && (
                        <View style={{alignSelf: 'center'}}>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                      )}
                    </View>
                  ),
                },
                ...(itm?.item_id
                  ? [
                      {
                        key: type == 'approve' ? 'Punch qty' : 'Remaining qty',
                        component: (
                          <Badge
                            value={
                              type == 'approve'
                                ? converToString(itm.remaining_approved_qty)
                                : `${
                                    itm.remaining_qty
                                      ? converToString(itm.remaining_qty)
                                      : 0
                                  }`
                            }
                            status="primary"
                          />
                        ),
                      },
                    ]
                  : []),

                ...(type == 'approve'
                  ? [
                      {
                        component: (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              flex: 1,
                            }}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              pay mode :{' '}
                            </Text>
                            <View
                              style={{
                                justifyContent: 'center',
                                flex: 1,
                              }}>
                              <Dropdown
                                placeholder={'select...'}
                                data={payMethod}
                                labelField={'label'}
                                valueField={'value'}
                                value={itm?.payment_mode}
                                renderItem={renderDropDown}
                                search={false}
                                placeholderStyle={[
                                  styles.inputText,
                                  {color: Colors().pureBlack},
                                ]}
                                selectedTextStyle={[
                                  styles.selectedTextStyle,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[
                                  styles.inputText,
                                  {color: Colors().pureBlack},
                                ]}
                                containerStyle={{
                                  backgroundColor: Colors().inputLightShadow,
                                }}
                                onChange={val => {
                                  formik.setFieldValue(
                                    `items.${idx}.payment_mode`,
                                    val.value,
                                  );
                                }}
                              />
                            </View>
                          </View>
                        ),
                      },
                    ]
                  : []),
                ...(type == 'approve'
                  ? [
                      {
                        component: (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              transaction id :{' '}
                            </Text>

                            <TextInput
                              placeholder="TYPE..."
                              placeholderTextColor={Colors().gray2}
                              style={[
                                styles.inputText,
                                {
                                  height: 20,
                                  padding: 1,
                                  paddingLeft: 5,
                                  alignSelf: 'center',
                                  color: Colors().pureBlack,
                                  justifyContent: 'center',
                                  flexShrink: 1,
                                },
                              ]}
                              value={itm.transaction_no}
                              onChangeText={formik.handleChange(
                                `items.${idx}.transaction_no`,
                              )}
                            />
                          </View>
                        ),
                      },
                    ]
                  : []),
                ...(type == 'approve'
                  ? [
                      {
                        key: 'date & time',
                        value: converToString(itm.punch_at),
                      },
                    ]
                  : []),

                ...(itm?.item_id
                  ? [
                      {
                        component: (
                          <>
                            <View
                              style={{
                                flexWrap: 'wrap',
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}>
                                {type == 'approve'
                                  ? 'approve qty : '
                                  : 'qty. : '}
                              </Text>
                              <IncreDecreComponent
                                defaultValue={
                                  type == 'approve'
                                    ? `${
                                        itm.approve_qty
                                          ? converToNumber(itm.approve_qty)
                                          : converToNumber(0)
                                      }`
                                    : converToNumber(itm.qty)
                                }
                                MaxValue={
                                  type == 'approve'
                                    ? converToNumber(itm.remaining_approved_qty)
                                    : converToNumber(itm.remaining_qty)
                                }
                                formik={formik}
                                keyToSet={
                                  type == 'approve'
                                    ? `items.${idx}.approve_qty`
                                    : `items.${idx}.qty`
                                }
                                onChange={onIncreDecre}
                              />
                            </View>

                            {(type == 'approve'
                              ? itm?.approve_qty == 0 ||
                                itm?.approve_qty == undefined
                              : itm?.qty == 0) && (
                              <View style={{alignSelf: 'center'}}>
                                <Icon
                                  name="asterisk"
                                  type={IconType.FontAwesome5}
                                  size={8}
                                  color={Colors().red}
                                />
                              </View>
                            )}
                          </>
                        ),
                      },
                    ]
                  : []),
              ]}
              status={
                itm?.item_id
                  ? [
                      {
                        key: 'Total price',
                        value: `₹ ${
                          itm.sub_total ? converToString(itm.sub_total) : 0
                        }`,
                        color: Colors().pending,
                      },
                    ]
                  : null
              }
            />
          </View>
        );
      })}
      {type != 'approve' && (
        <View style={styles.addMoreView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.title, {color: Colors().purple}]}>
              Final Amount ₹ {getTotal(formik.values.items, 'sub_total')}
            </Text>
          </View>
        </View>
      )}

      {type != 'approve' && (
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
              onPress={() => {
                formik.setFieldValue(`items`, [
                  ...formik.values.items,
                  {
                    qty: '',
                  },
                ]);
              }}
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
            Add item
          </Text>
        </View>
      )}
    </View>
  );
};

export default ExpenseItemComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: 12.5,
    top: 8,
    zIndex: 1,
    justifyContent: 'center',
  },

  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  addMoreView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: WINDOW_WIDTH * 0.03,
  },
  selectedTextStyle: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
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

  inputText: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',

    margin: 3,
  },
});

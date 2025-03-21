/*    ----------------Created Date :: 23- April -2024   ----------------- */

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
  getApproveStockItemPriceByUserId,
  getStockItemListByUserId,
} from '../../../redux/slices/commonApi';
import {Dropdown} from 'react-native-element-dropdown';
import CustomeCard from '../../../component/CustomeCard';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import {selectUser} from '../../../redux/slices/authSlice';

const SPTransferItemComponent = ({formik, type, edit}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    fetchItemData();
  }, [formik.values.transfered_by, formik.values.stock_transfer_for]);

  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(
        getStockItemListByUserId(
          formik.values.stock_transfer_for == '1'
            ? user.id
            : formik.values.transfered_by,
        ),
      ).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.item_name,
          value: itm?.product_id,
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

  /*function for fetching item  stock detail*/
  const handleItemChange = async (itemId, index, item_image) => {
    const userId =
      formik.values.stock_transfer_for == '1'
        ? user.id
        : formik.values.transfered_by;
    try {
      const result = await dispatch(
        getApproveStockItemPriceByUserId({itemId, userId}),
      ).unwrap();

      if (result.status) {
        formik.setFieldValue(
          `transfer_items.${index}.id`,
          result?.data[0]?.stock_id,
        );
        formik.setFieldValue(
          `transfer_items.${index}.item_id`,
          result?.data[0]?.item_id,
        );

        formik.setFieldValue(
          `transfer_items.${index}.remaining_item_qty`,
          result?.data[0]?.remaining_quantity,
        );
        formik.setFieldValue(
          `transfer_items.${index}.approved_price`,
          result?.data[0]?.item_price,
        );
        formik.setFieldValue(
          `transfer_items.${index}.supplier_name`,
          result?.data[0]?.supplier_name,
        );
        formik.setFieldValue(`transfer_items.${index}.item_image`, item_image);
      }
    } catch (error) {}
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

  const onIncreDecre = ({returnValue, formik, keyToSet}) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the middle value

    multipliedPrice(
      returnValue,
      formik.values.transfer_items[index]?.approved_price, //fixed value
      `transfer_items.${index}.transfer_amount`,
      formik.setFieldValue,
    );
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
    <View style={{}}>
      {formik.values?.transfer_items?.map((itm, idx) => {
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
                      `transfer_items`,
                      formik.values.transfer_items.filter((_, i) => i !== idx),
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
                      <Text style={[styles.title, {color: Colors().pureBlack}]}>
                        item name :{' '}
                      </Text>

                      <View style={{flex: 1}}>
                        <Dropdown
                          data={allItem}
                          placeholder={'select...'}
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
                        key: 'Remaining qty',
                        component: (
                          <Badge
                            value={`${
                              itm?.remaining_item_qty
                                ? itm?.remaining_item_qty
                                : 0
                            }`}
                            status="primary"
                          />
                        ),
                      },
                    ]
                  : []),

                ...(itm?.item_id
                  ? [
                      {
                        key: 'Item Price ',
                        value: `₹ ${itm?.approved_price}`,
                        keyColor: Colors().aprroved,
                      },
                    ]
                  : []),

                ...(itm?.item_id
                  ? [
                      {
                        key: 'Supplier name ',
                        value: itm?.supplier_name,
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
                                  styles.title,
                                  {color: Colors().pureBlack},
                                ]}>
                                {'Transfer qty. : '}
                              </Text>
                              <IncreDecreComponent
                                defaultValue={itm?.transfer_item_qty}
                                MaxValue={itm.remaining_item_qty}
                                formik={formik}
                                keyToSet={`transfer_items.${idx}.transfer_item_qty`}
                                onChange={onIncreDecre}
                              />
                            </View>
                            {itm?.transfer_item_qty == 0 && (
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
                        value: `₹ ${itm?.transfer_amount || 0}`,
                        color: Colors().pending,
                      },
                    ]
                  : null
              }
            />
          </View>
        );
      })}

      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.title, {color: Colors().purple, marginLeft: 30}]}>
          Final Amount ₹{' '}
          {getTotal(formik.values.transfer_items, 'transfer_amount')}
        </Text>
      </View>
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
                formik.setFieldValue(`transfer_items`, [
                  ...formik.values.transfer_items,
                  {
                    id: '',
                    remaining_item_qty: 0,
                    transfer_item_qty: 0,
                    approved_price: 0,
                    transfer_amount: 0,
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
                fontSize: 16,
              },
            ]}>
            Add item
          </Text>
        </View>
      )}
    </View>
  );
};

export default SPTransferItemComponent;

const styles = StyleSheet.create({
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
  selectedTextStyle: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
    fontSize: 13,
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

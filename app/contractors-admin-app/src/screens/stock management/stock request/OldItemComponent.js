/*    ----------------Created Date :: 12- April -2024   ----------------- */

import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';

import IconType from '../../../constants/IconType';
import { useDispatch, useSelector } from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import { Avatar, Badge } from '@rneui/themed';
import Colors from '../../../constants/Colors';
import { Icon } from '@rneui/base';

import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { apiBaseUrl } from '../../../../config';
import Images from '../../../constants/Images';
import {
  getAllGstType,
  getItemMasterDropDown,
} from '../../../redux/slices/commonApi';
import { selectUser } from '../../../redux/slices/authSlice';
import LowPriceTable from '../../fund management/fund request/LowPriceTable';
import CustomeCard from '../../../component/CustomeCard';
import { Dropdown } from 'react-native-element-dropdown';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import { TextInput } from 'react-native';
import { getAllSubCategory } from '../../../services/authApi';

const OldItemComponent = ({ item, index, formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [showTable, setShowTable] = useState([]);
  const [allItem, setAllItem] = useState([]);
  const [allGst, setAllGst] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);

  useEffect(() => {
    fetchItemData();
    fetchAllGstType();
    fetchAllSubCategory();
  }, []);

  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(
        getItemMasterDropDown({ category: 'stock' }),
      ).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          unique_id: itm?.unique_id,
          rate: itm?.rate,
          hsncode: itm?.hsncode,
          description: itm?.description,
          image: itm?.image,
          sub_category: itm?.sub_category,
        }));

        setAllItem(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setAllItem([]);
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

  /*function for fetching item  stock detail*/
  const handleItemChange = async (
    itemId,
    userId,
    index,
    idx,
    setFormikValues,
  ) => {
    try {
      const result = await dispatch(
        getStockRequestDetailByItemId({ itemId, userId }),
      ).unwrap();

      if (result.status) {
        setFormikValues(
          `request_stock_by_user.${index}.request_stock.${idx}.prev_user_stock`,
          result?.data?.quantity,
        );
        setFormikValues(
          `request_stock_by_user.${index}.request_stock.${idx}.prev_item_price`,
          result?.data?.item_price,
        );
      } else {
        setFormikValues(
          `request_stock_by_user.${index}.request_stock.${idx}.prev_user_stock`,
          0,
        );
        setFormikValues(
          `request_stock_by_user.${index}.request_stock.${idx}.prev_item_price`,
          0,
        );
      }
    } catch (error) {
      setFormikValues(
        `request_stock_by_user.${index}.request_stock.${idx}.prev_user_stock`,
        0,
      );
      setFormikValues(
        `request_stock_by_user.${index}.request_stock.${idx}.prev_item_price`,
        0,
      );
    }
  };

  /* Handle Gst change */
  const handleGstChange = async (
    percentage,
    rate,
    index,
    idx,
    setFormikValues,
  ) => {
    const priceWithGst = rate + (rate * percentage) / 100;

    setFormikValues(
      `request_stock_by_user.${index}.request_stock.${idx}.current_item_price`,
      parseFloat(priceWithGst),
    );
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
    const total = (changeAblevalue * fixedValue).toFixed(2);
    setFormikValues(assignKey, parseFloat(isNaN(total) ? 0 : total));
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

  const renderSubCategory = item => {
    return (
      <View
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
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

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'down':
        const { index, idx } = actionButton?.itemData;
        formik.setFieldValue(
          `request_stock_by_user.${index}.request_stock.${idx}.Old_Price_Viewed`,
          true,
        ),
          setShowTable(prevState => {
            const newState = [...prevState];
            newState[idx] = !newState[idx];
            return newState;
          });

        break;

      default:
        break;
    }
  };

  const onIncreDecre = ({ returnValue, formik, keyToSet }) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    if (type == 'approve') {
      multipliedPrice(
        returnValue, //change value
        formik.values.request_stock_by_user[index]?.request_stock[idx]
          ?.approve_price, // itm.current_item_price, //fixed value
        `request_stock_by_user.${index}.request_stock.${idx}.approve_fund_amount`,
        formik.setFieldValue,
      );
    } else {
      multipliedPrice(
        returnValue, //change value
        formik.values.request_stock_by_user[index]?.request_stock[idx]
          ?.current_item_price, // itm.current_item_price, //fixed value
        `request_stock_by_user.${index}.request_stock.${idx}.total_price`,
        formik.setFieldValue,
      );
    }
  };

  const renderBrands = item => {
    return (
      <View
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
        {item?.brand && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.brand}
          </Text>
        )}
      </View>
    );
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

  const fetchAllSubCategory = async () => {
    try {
      const result = await getAllSubCategory();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));

        setAllSubCategory(rData);
      } else {
        setAllSubCategory([]);
      }
    } catch (error) {
      setAllSubCategory([]);
    }
  };

  return (
    <View style={{}}>
      <View style={styles.separatorHeading}>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.2}
        />
        <Text style={[styles.title, { color: Colors().pending }]}>
          {`Old item stock Request`}
        </Text>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.2}
        />
      </View>
      {item?.request_stock?.map((itm, idx) => (
        <View>
          {type != 'approve' && (
            <View style={styles.crossIcon}>
              <Icon
                name="close"
                color={Colors().lightShadow}
                type={IconType.AntDesign}
                size={12}
                onPress={() =>
                  formik.setFieldValue(
                    `request_stock_by_user.${index}.request_stock`,
                    formik.values.request_stock_by_user[
                      index
                    ].request_stock.filter((_, i) => i !== idx),
                  )
                }
              />
            </View>
          )}

          <CustomeCard
            allData={{ index, idx, showTable, itm }}
            avatarImage={edit_id ? itm?.item_name?.image : itm?.item_image}
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
                        { color: Colors().pureBlack },
                      ]}>
                      item name :{' '}
                    </Text>

                    <View style={{ flex: 1 }}>
                      <Dropdown
                        data={allItem}
                        placeholder={'select...'}
                        labelField={'label'}
                        valueField={'value'}
                        value={itm?.item_name}
                        renderItem={renderDropDown}
                        search={false}
                        disable={type == 'approve'}
                        placeholderStyle={[
                          styles.inputText,
                          { color: Colors().pureBlack },
                        ]}
                        selectedTextStyle={[
                          styles.selectedTextStyle,
                          { color: Colors().pureBlack },
                        ]}
                        style={[
                          styles.inputText,
                          { color: Colors().pureBlack },
                        ]}
                        containerStyle={{
                          backgroundColor: Colors().inputLightShadow,
                        }}
                        onChange={val => {
                          formik.setFieldValue(
                            `request_stock_by_user.${index}.request_stock.${idx}.item_name`,
                            val,
                          );
                          formik.setFieldValue(
                            `request_stock_by_user.${index}.request_stock.${idx}.item_image`,
                            val.image,
                          );

                          formik.setFieldValue(
                            `request_stock_by_user.${index}.request_stock.${idx}.item_name.rates`,
                            val?.rates,
                          );
                          formik.setFieldValue(
                            `request_stock_by_user.${index}.request_stock.${idx}.current_item_price`,
                            val?.rate,
                          );
                          {
                            formik.values.request_tax_type == '1' &&
                              itm?.gst_percent &&
                              handleGstChange(
                                itm?.gst_percent,
                                val?.rate,
                                index,
                                idx,
                                formik.setFieldValue,
                              );
                          }

                          handleItemChange(
                            val?.value,
                            user.id,
                            index,
                            idx,
                            formik.setFieldValue,
                          );
                        }}
                      />
                    </View>
                    {!itm?.item_name && (
                      <View style={{}}>
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
              ...(itm?.item_name
                ? [
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Brand :{' '}
                          </Text>
                          <View style={{ flex: 1 }}>
                            <Dropdown
                              data={
                                formik?.values?.request_stock_by_user[index]
                                  ?.request_stock[idx].item_name?.rates
                              }
                              placeholder={'select...'}
                              labelField={'brand'}
                              valueField={'item_rates_id'}
                              value={itm.item_name?.rates[0]?.item_rates_id}
                              renderItem={renderBrands}
                              search={false}
                              disable={type == 'approve'}
                              placeholderStyle={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              selectedTextStyle={[
                                styles.selectedTextStyle,
                                { color: Colors().pureBlack },
                              ]}
                              style={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              containerStyle={{
                                backgroundColor: Colors().inputLightShadow,
                              }}
                              onChange={val => {
                                formik.setFieldValue(
                                  `request_stock_by_user.${index}.request_stock.${idx}.brand`,
                                  val.value,
                                );
                              }}
                            />
                          </View>
                        </View>
                      ),
                    },
                  ]
                : ''),

              ...(itm?.item_name
                ? [
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Sub Category :{' '}
                            {/* <Text>
                              {JSON.stringify(
                                allItem?.filter(
                                  i => i?.label == itm?.item_name?.label,
                                )[0].sub_category,
                              )}
                            </Text> */}
                          </Text>
                          <View style={{ flex: 1 }}>
                            <Dropdown
                              data={allSubCategory}
                              placeholder={'select...'}
                              labelField={'label'}
                              valueField={'label'}
                              value={
                                allItem?.filter(
                                  i => i?.label == itm?.item_name?.label,
                                )[0]?.sub_category
                              }
                              renderItem={renderSubCategory}
                              search={false}
                              disable={type == 'approve'}
                              placeholderStyle={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              selectedTextStyle={[
                                styles.selectedTextStyle,
                                { color: Colors().pureBlack },
                              ]}
                              style={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              containerStyle={{
                                backgroundColor: Colors().inputLightShadow,
                              }}
                              onChange={val => {
                                formik.setFieldValue(
                                  `request_stock_by_user.${index}.request_stock.${idx}.sub_category`,
                                  val,
                                );
                              }}
                            />
                          </View>
                        </View>
                      ),
                    },
                  ]
                : ''),
              ...(itm?.item_name
                ? [
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flex: 1,
                          }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.title,
                                { color: Colors().pureBlack },
                              ]}>
                              Stock :{' '}
                            </Text>
                            <Badge
                              value={itm?.prev_user_stock}
                              status="primary"
                            />
                          </View>
                          {formik.values.request_tax_type == '1' && (
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                GSt % :{' '}
                              </Text>

                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pending },
                                ]}>
                                {itm?.gst_percent ? itm?.gst_percent : 0}
                              </Text>
                            </View>
                          )}
                        </View>
                      ),
                    },
                  ]
                : []),
              ...(itm?.item_name
                ? [
                    {
                      component: (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            PRev. Price :{' '}
                          </Text>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            ₹ {itm?.prev_item_price}
                          </Text>
                        </View>
                      ),
                    },
                  ]
                : []),
              // ...(itm?.item_name
              //   ? [
              //       {
              //         component: (
              //           <View style={{flexDirection: 'row'}}>
              //             <Text
              //               style={[styles.title, {color: Colors().pureBlack}]}>
              //               Current Price :{' '}
              //             </Text>
              //             <Text
              //               style={[styles.title, {color: Colors().aprroved}]}>
              //               ₹ {itm?.current_item_price}
              //             </Text>
              //           </View>
              //         ),
              //       },
              //     ]
              //   : []),
              ...(itm?.item_name
                ? [
                    {
                      component: (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Request Price :{' '}
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
                            keyboardType="Numeric"
                            value={itm?.current_item_price?.toString()}
                            onChangeText={formik.handleChange(
                              `request_stock_by_user.${index}.request_stock.${idx}.current_item_price`,
                            )}
                          />
                        </View>
                      ),
                    },
                  ]
                : []),
              ...(itm?.item_name && type == 'approve'
                ? [
                    {
                      component: (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Request qty :{' '}
                          </Text>
                          <Badge
                            value={itm?.request_quantity}
                            status="primary"
                          />
                        </View>
                      ),
                    },
                  ]
                : []),
              ...(itm?.item_name && type == 'approve'
                ? [
                    {
                      component: (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Total Price :{' '}
                          </Text>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            ₹ {itm?.total_price ? itm?.total_price : 0}
                          </Text>
                        </View>
                      ),
                    },
                  ]
                : []),
              ...(itm?.item_name && formik.values.request_tax_type == '1'
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
                              { color: Colors().pureBlack },
                            ]}>
                            Gst type :{' '}
                          </Text>

                          <View style={{ flex: 1 }}>
                            <Dropdown
                              data={allGst}
                              placeholder={'select...'}
                              labelField={'label'}
                              valueField={'value'}
                              value={itm?.gst_id}
                              renderItem={renderDropDown}
                              search={false}
                              disable={type == 'approve'}
                              placeholderStyle={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              selectedTextStyle={[
                                styles.selectedTextStyle,
                                { color: Colors().pureBlack },
                              ]}
                              style={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              containerStyle={{
                                backgroundColor: Colors().inputLightShadow,
                              }}
                              onChange={val => {
                                formik.setFieldValue(
                                  `request_stock_by_user.${index}.request_stock.${idx}.gst_id`,
                                  val,
                                );

                                formik.setFieldValue(
                                  `request_stock_by_user.${index}.request_stock.${idx}.gst_percent`,
                                  val?.percentage,
                                );
                                handleGstChange(
                                  val?.percentage,
                                  itm.item_name.rate,
                                  index,
                                  idx,
                                  formik.setFieldValue,
                                );
                              }}
                            />
                          </View>
                          {!itm?.gst_id && (
                            <View>
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
                  ]
                : []),
              ...(itm?.item_name && type == 'approve'
                ? [
                    {
                      component: (
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Approve Price : ₹
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
                            value={converToString(itm.approve_price)}
                            onSelectionChange={tetx => {
                              multipliedPrice(
                                tetx?._dispatchInstances?.memoizedProps?.text,
                                itm.approve_quantity,
                                `request_stock_by_user.${index}.request_stock.${idx}.approve_fund_amount`,
                                formik.setFieldValue,
                              );
                            }}
                            onChangeText={txt => {
                              formik.setFieldValue(
                                `request_stock_by_user.${index}.request_stock.${idx}.approve_price`,
                                Number(txt) >= Number(itm.current_item_price)
                                  ? itm.current_item_price
                                  : txt,
                              );
                            }}
                          />
                          {!itm.approve_price && type == 'approve' && (
                            <View style={{ alignSelf: 'center' }}>
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
                  ]
                : []),
              ...(itm?.item_name
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
                                { color: Colors().pureBlack },
                              ]}>
                              {type == 'approve'
                                ? 'approve qty : '
                                : 'Request qty. : '}
                            </Text>
                            <IncreDecreComponent
                              defaultValue={
                                type == 'approve'
                                  ? itm?.approve_quantity || 0
                                  : itm?.request_quantity || 0
                              }
                              MaxValue={
                                type == 'approve'
                                  ? itm?.request_quantity
                                  : +Infinity
                              }
                              formik={formik}
                              keyToSet={
                                type == 'approve'
                                  ? `request_stock_by_user.${index}.request_stock.${idx}.approve_quantity`
                                  : `request_stock_by_user.${index}.request_stock.${idx}.request_quantity`
                              }
                              onChange={onIncreDecre}
                            />
                          </View>

                          {(itm.request_quantity == 0 ||
                            itm?.approve_quantity == 0) && (
                            <View style={{ alignSelf: 'center' }}>
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
              itm?.item_name
                ? [
                    {
                      key: type == 'approve' ? 'Approve Fund' : 'Total Price',
                      // value: `₹ ${
                      //   itm?.total_price ? converToString(itm?.total_price) : 0
                      // }`,
                      value:
                        type == 'approve'
                          ? `₹ ${
                              itm.approve_fund_amount
                                ? converToString(itm.approve_fund_amount)
                                : 0
                            }`
                          : `₹ ${
                              itm?.current_item_price
                                ? converToString(
                                    itm?.current_item_price *
                                      itm?.request_quantity,
                                  )
                                : 0
                            }`,
                      color: Colors().pending,
                    },
                  ]
                : null
            }
            downButton={type == 'approve' ? true : false}
            action={handleAction}
          />

          {type == 'approve' && itm.Old_Price_Viewed && (
            <LowPriceTable
              hsncode={itm?.item_name?.hsncode}
              itemId={itm?.item_name?.value}
              userId={user.id}
              index={idx}
              visible={showTable}
            />
          )}
        </View>
      ))}

      {formik.values.request_tax_type == '1' && type != 'approve' && (
        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Text style={[styles.title, { color: Colors().purple }]}>
            TOTAL REQUEST PRice ₹{' '}
            {getTotal(
              formik.values.request_stock_by_user[index].request_stock,
              'total_price',
            )}
          </Text>
        </View>
      )}

      {formik.values.request_tax_type == '2' && type != 'approve' && (
        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Text style={[styles.title, { color: Colors().purple }]}>
            TOTAL PRice ₹{' '}
            {getTotal(
              formik.values.request_stock_by_user[index].request_stock,
              'total_price',
            )}{' '}
            included gst ₹{' '}
            {getTotal(
              formik.values.request_stock_by_user[index].request_stock,
              'total_price',
            ) +
              (getTotal(
                formik.values.request_stock_by_user[index].request_stock,
                'total_price',
              ) *
                item.gst_percent) /
                100}
          </Text>
        </View>
      )}

      {type != 'approve' && (
        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Text style={[styles.title, { color: Colors().purple }]}>
            TOTAL REQUEST quantity{' '}
            {getTotal(
              formik.values.request_stock_by_user[index].request_stock,
              'request_quantity',
            )}
          </Text>
        </View>
      )}

      {formik.values.request_stock_by_user[index].request_stock.length > 0 &&
        type == 'approve' && (
          <View style={{ flexDirection: 'row', marginLeft: 30 }}>
            <Text style={[styles.title, { color: Colors().purple }]}>
              TOTAL Approve Qty ₹{' '}
              {getTotal(
                formik.values.request_stock_by_user[index].request_stock,
                'approve_quantity',
              )}
            </Text>
          </View>
        )}

      {formik.values.request_stock_by_user[index].request_stock.length > 0 &&
        type == 'approve' && (
          <View style={{ flexDirection: 'row', marginLeft: 30 }}>
            <Text style={[styles.title, { color: Colors().purple }]}>
              TOTAL Approve AMOUNT ₹{' '}
              {getTotal(
                formik.values.request_stock_by_user[index].request_stock,
                'approve_fund_amount',
              )}
            </Text>
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
                formik.setFieldValue(
                  `request_stock_by_user.${index}.request_stock`,
                  [
                    ...formik.values.request_stock_by_user[index].request_stock,
                    {
                      item_name: '',
                      description: '',
                      prev_item_price: '',
                      prev_user_stock: '',
                      current_item_price: '',
                      request_quantity: '',
                      total_price: '',
                      gst_percent: '',
                      gst_id: '',
                    },
                  ],
                );
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
            old item
          </Text>
        </View>
      )}
    </View>
  );
};

export default OldItemComponent;

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

  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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

  errorMesage: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontSize: 13,
    fontFamily: Colors().fontFamilyBookMan,
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
});

import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphCard from '../../../component/NeumorphCard';
import IconType from '../../../constants/IconType';
import {
  getFundRequestDetailByItemId,
  getItemMasterDropDown,
} from '../../../redux/slices/commonApi';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { Avatar, Badge, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { apiBaseUrl } from '../../../../config';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import { Dropdown } from 'react-native-element-dropdown';
import { selectUser } from '../../../redux/slices/authSlice';
import { TextInput } from 'react-native';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import LowPriceTable from './LowPriceTable';
import Images from '../../../constants/Images';
import { getAllSubCategory } from '../../../services/authApi';
import { cleanSingle } from 'react-native-image-crop-picker';

const OldFundRequestItem = ({ item, index, formik, type, edit_id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [allItem, setAllItem] = useState([]);
  const [showTable, setShowTable] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);

  useEffect(() => {
    fetchAllSubCategory();
  }, []);

  useEffect(() => {
    fetchItemData();

    if (edit_id) {
      //   fetchSingleDetails();
    }
  }, [edit_id]);

  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(
        getItemMasterDropDown({ category: 'fund' }),
      ).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          unique_id: itm?.unique_id,
          rates: itm?.rates,
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

  /*function for fetching item  stock detail*/
  const handleItemChange = async (itemId, index, idx, setFormikValues) => {
    try {
      const result = await dispatch(
        getFundRequestDetailByItemId({ itemId }),
      ).unwrap();

      if (result.status) {
        setFormikValues(
          `request_data.${index}.request_fund.${idx}.current_user_stock`,
          String(result?.data?.request_qty),
        );
        setFormikValues(
          `request_data.${index}.request_fund.${idx}.previous_price`,
          String(result?.data?.item_price),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setFormikValues(
          `request_data.${index}.request_fund.${idx}.current_user_stock`,
          '0',
        );
        setFormikValues(
          `request_data.${index}.request_fund.${idx}.previous_price`,
          '0',
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setFormikValues(
        `request_data.${index}.request_fund.${idx}.current_user_stock`,
        '0',
      );
      setFormikValues(
        `request_data.${index}.request_fund.${idx}.previous_price`,
        '0',
      );
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
                  : `${Image?.resolveAssetSource(Images?.DEFAULT_PROFILE)?.uri}`,
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
          `request_data.${index}.request_fund.${idx}.Old_Price_Viewed`,
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

  const onIncreDecre = ({ returnValue, formik, keyToSet }) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    if (type == 'approve') {
      multipliedPrice(
        returnValue, //change value
        formik.values.request_data[index].request_fund[idx].price, // itm.current_item_price, //fixed value
        `request_data.${index}.request_fund.${idx}.total_approve_amount`,
        formik.setFieldValue,
      );
    } else {
      multipliedPrice(
        returnValue, //change value
        formik.values.request_data[index].request_fund[idx].new_price, // itm.current_item_price, //fixed value
        `request_data.${index}.request_fund.${idx}.fund_amount`,
        formik.setFieldValue,
      );
    }
  };
  /* function  which covert number to string */
  const converToString = value => {
    if (typeof value == 'number') {
      return String(value);
    } else {
      return value;
    }
  };

  return (
    <View>
      <View style={styles.separatorHeading}>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.32}
        />
        <Text style={[styles.title, { color: Colors().pending, fontSize: 16 }]}>
          {` Old item `}
        </Text>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.32}
        />
      </View>
      {item?.request_fund?.map((itm, idx) => (
        <View>
          {type != 'approve' && (
            <View style={styles.crossIcon}>
              <Icon
                name="close"
                color={Colors().pureBlack}
                type={IconType.AntDesign}
                size={12}
                onPress={() =>
                  formik.setFieldValue(
                    `request_data.${index}.request_fund`,
                    formik.values.request_data[index].request_fund.filter(
                      (_, i) => i !== idx,
                    ),
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
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
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
                            `request_data.${index}.request_fund.${idx}.item_name`,
                            val,
                          );

                          formik.setFieldValue(
                            `request_data.${index}.request_fund.${idx}.current_price`,
                            val?.rate,
                          );
                          formik.setFieldValue(
                            `request_data.${index}.request_fund.${idx}.item_name.rates`,
                            val?.rates,
                          );
                          handleItemChange(
                            val?.value,
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
                                formik?.values?.request_data[index]
                                  .request_fund[idx].item_name?.rates
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
                                  `request_data.${index}.request_fund.${idx}.brand`,
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
                                  `request_data.${index}.request_fund.${idx}.sub_category`,
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
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            description :
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
                            value={itm.description}
                            onChangeText={formik.handleChange(
                              `request_data.${index}.request_fund.${idx}.description`,
                            )}
                          />
                        </View>
                      ),
                    },
                  ]
                : []),
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
                              value={itm?.current_user_stock}
                              status="primary"
                            />
                          </View>
                          {type == 'approve' && (
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                Req.Qty :{' '}
                              </Text>
                              <Badge
                                value={itm?.request_quantity}
                                badgeStyle={{
                                  backgroundColor: Colors().pending,
                                }}
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
                            ₹ {itm?.previous_price}
                          </Text>
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
                            Item Price :{' '}
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
                            defaultValue={itm?.new_price?.toString()}
                            onChangeText={formik.handleChange(
                              `request_data.${index}.request_fund.${idx}.new_price`,
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
                            request Amt. :{' '}
                          </Text>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            ₹ {itm?.fund_amount ? itm?.fund_amount : 0}
                          </Text>
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
                            value={
                              converToString(+itm?.price)
                              // formik?.values?.request_data[index]?.request_fund[
                              //   idx
                              // ]?.price
                            }
                            onSelectionChange={tetx => {
                              multipliedPrice(
                                tetx?._dispatchInstances?.memoizedProps?.text,
                                itm.quantity,
                                `request_data.${index}.request_fund.${idx}.total_approve_amount`,
                                formik.setFieldValue,
                              );
                            }}
                            onChangeText={txt => {
                              formik.setFieldValue(
                                `request_data.${index}.request_fund.${idx}.price`,
                                txt,
                                +txt >= +itm?.current_price
                                  ? +itm?.current_price
                                  : txt,
                              );
                            }}
                          />
                          {!itm.price && type == 'approve' && (
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
                                styles.title,
                                { color: Colors().pureBlack },
                              ]}>
                              {type == 'approve'
                                ? 'approve qty : '
                                : 'Request qty. : '}
                            </Text>
                            <IncreDecreComponent
                              defaultValue={
                                type == 'approve'
                                  ? itm?.quantity || 0
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
                                  ? `request_data.${index}.request_fund.${idx}.quantity`
                                  : `request_data.${index}.request_fund.${idx}.request_quantity`
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
                      key:
                        type == 'approve' ? 'Approve Amount' : 'Request amount',

                      value:
                        type == 'approve'
                          ? `₹ ${itm?.total_approve_amount || 0}`
                          : `₹ ${+itm?.new_price * itm?.request_quantity || 0}`,
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
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={[styles.title, { color: Colors().purple, marginLeft: 30 }]}>
          TOTAL REQUEST AMOUNT ₹{' '}
          {formik.values.request_data[index].request_fund.reduce(
            (total, itm) => total + +itm.new_price * +itm?.request_quantity,
            0,
          )}
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
                formik.setFieldValue(`request_data.${index}.request_fund`, [
                  ...formik.values.request_data[index].request_fund,
                  {
                    item_name: '',
                    description: '',
                    current_user_stock: '',
                    previous_price: '',
                    current_price: '',
                    request_quantity: '',
                    fund_amount: '',
                    price: '',
                    quantity: '',
                    request_transfer_fund: 0,
                    total_approve_amount: '',
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
            old item
          </Text>
        </View>
      )}
    </View>
  );
};

export default OldFundRequestItem;

const styles = StyleSheet.create({
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },

  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },

  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    margin: 3,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
});

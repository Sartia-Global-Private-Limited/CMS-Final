/*    ----------------Created Date :: 5- August -2024   ----------------- */
import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import IconType from '../../../constants/IconType';
import {useDispatch} from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import Colors from '../../../constants/Colors';
import {Icon} from '@rneui/base';
import {getAllGstType} from '../../../redux/slices/commonApi';
import CustomeCard from '../../../component/CustomeCard';
import {Dropdown} from 'react-native-element-dropdown';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import DropDownItem from '../../../component/DropDownItem';
import CardDropDown from '../../../component/CardDropDown';
import CardTextInput from '../../../component/CardTextInput';

const SOItem = ({item, index, formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();

  const [allGst, setAllGst] = useState([]);

  useEffect(() => {
    fetchAllGstType();
  }, []);

  const gstChangeType = [
    {label: 'individual', value: '1'},
    {label: 'overall', value: '2'},
  ];

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

  const onIncreDecre = ({returnValue, formik, keyToSet}) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index

    multipliedPrice(
      returnValue, //change value
      formik?.values?.so_items[index]?.rate, // item.current_item_price, //fixed value
      `so_items.${index}.amount`,
      formik.setFieldValue,
    );
  };

  return (
    <View style={{}}>
      <View style={styles.separatorHeading}>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.2}
        />
        <Text style={[styles.title, {color: Colors().pending, fontSize: 16}]}>
          {`sO ITem list`}
        </Text>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.2}
        />
      </View>

      {formik?.values?.so_items?.map((item, index) => {
        return (
          <View>
            {type != 'approve' && (
              <View style={styles.crossIcon}>
                <Icon
                  name="close"
                  type={IconType.AntDesign}
                  color={Colors().inputLightShadow}
                  size={12}
                  onPress={() =>
                    formik.setFieldValue(
                      `so_items`,
                      formik?.values?.so_items.filter((_, i) => i !== index),
                    )
                  }
                />
              </View>
            )}

            <CustomeCard
              allData={{index, item}}
              data={[
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',

                          flex: 1,
                          maxWidth: '50%',
                        }}>
                        <Text
                          style={[styles.title, {color: Colors().pureBlack}]}>
                          order line :{' '}
                        </Text>
                        <TextInput
                          placeholder="TYPE..."
                          placeholderTextColor={Colors().pureBlack}
                          style={[styles.inputText, styles.inputext2]}
                          value={
                            item?.order_line_number
                              ? `${item?.order_line_number}`
                              : ''
                          }
                          onChangeText={formik.handleChange(
                            `so_items.${index}.order_line_number`,
                          )}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <Text
                          style={[styles.title, {color: Colors().pureBlack}]}>
                          hsncode :{' '}
                        </Text>
                        <TextInput
                          placeholder="TYPE..."
                          placeholderTextColor={Colors().pureBlack}
                          style={[styles.inputText, styles.inputext2]}
                          value={item?.hsn_code ? item?.hsn_code : ''}
                          onChangeText={formik.handleChange(
                            `so_items.${index}.hsn_code`,
                          )}
                        />
                      </View>
                    </View>
                  ),
                },
                {
                  key: 'item name',
                  component: (
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().pureBlack}
                      style={[
                        styles.inputText,
                        styles.inputext2,
                        {alignSelf: 'center'},
                      ]}
                      value={item?.name ? item?.name : ''}
                      onChangeText={formik.handleChange(
                        `so_items.${index}.name`,
                      )}
                    />
                  ),
                },
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',

                          flex: 1,
                          maxWidth: '50%',
                        }}>
                        <Text
                          style={[styles.title, {color: Colors().pureBlack}]}>
                          unit :{' '}
                        </Text>
                        <TextInput
                          placeholder="TYPE..."
                          placeholderTextColor={Colors().pureBlack}
                          style={[styles.inputText, styles.inputext2]}
                          value={item?.unit ? item?.unit : ''}
                          onChangeText={formik.handleChange(
                            `so_items.${index}.unit`,
                          )}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <Text
                          style={[styles.title, {color: Colors().pureBlack}]}>
                          rate : ₹
                        </Text>
                        <TextInput
                          keyboardType="numeric"
                          placeholder="TYPE..."
                          placeholderTextColor={Colors().pureBlack}
                          style={[styles.inputText, styles.inputext2]}
                          value={item?.rate ? `${item?.rate}` : ''}
                          onChangeText={val => {
                            formik.setFieldValue(`so_items.${index}.rate`, val);
                            if (formik?.values?.so_for == '1') {
                              multipliedPrice(
                                val, //change value
                                formik?.values?.so_items[index]?.qty, // item.current_item_price, //fixed value
                                `so_items.${index}.amount`,
                                formik.setFieldValue,
                              );
                            }
                          }}
                        />
                      </View>
                    </View>
                  ),
                },
                {
                  key: 'change gst type',
                  component: (
                    <CardDropDown
                      data={gstChangeType}
                      value={item?.change_gst_type}
                      disable={type == 'approve'}
                      onChange={val => {
                        formik.setFieldValue(
                          `so_items.${index}.change_gst_type`,
                          val?.value,
                        );
                        if (val?.value == '1') {
                          const subTotal = +item.qty * +item.rate;

                          const totalGSTAmount =
                            subTotal * (item.gst_percent / 100);

                          formik.setFieldValue(
                            `so_items.${index}.total_gst_amount`,
                            +totalGSTAmount.toFixed(2),
                          );
                        } else {
                          formik.setFieldValue(
                            `so_items.${index}.amount`,
                            item.qty * item.rate,
                          );
                        }
                      }}
                    />
                  ),
                },

                ...(item?.change_gst_type === '1'
                  ? [
                      {
                        key: 'gst type',
                        component: (
                          <CardDropDown
                            data={allGst}
                            value={item?.gst_id}
                            disable={type == 'approve'}
                            onChange={e => {
                              formik.setFieldValue(
                                `so_items.${index}.gst_type`,
                                e.label,
                              );

                              const subTotal = +item.qty * +item.rate;
                              const totalGSTAmount =
                                subTotal * (e.percentage / 100);

                              formik.setFieldValue(
                                `so_items.${index}.amount`,
                                +subTotal,
                              );

                              formik.setFieldValue(
                                `so_items.${index}.total_gst_amount`,
                                +totalGSTAmount.toFixed(2),
                              );

                              formik.setFieldValue(
                                `so_items.${index}.gst_percent`,
                                e.percentage,
                              );
                              formik.setFieldValue(
                                `so_items.${index}.gst_id`,
                                e,
                              );
                            }}
                          />
                        ),
                      },
                    ]
                  : []),
                {
                  key: 'description',
                  component: (
                    <CardTextInput
                      value={item?.description ? item?.description : ''}
                      onChange={text =>
                        formik?.setFieldValue(
                          `so_items.${index}.description`,
                          text,
                        )
                      }
                    />
                  ),
                },

                ...(formik?.values?.so_for == '1'
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
                                {'qty. : '}
                              </Text>
                              <IncreDecreComponent
                                defaultValue={item?.qty || 0}
                                MaxValue={+Infinity}
                                formik={formik}
                                keyToSet={`so_items.${index}.qty`}
                                onChange={onIncreDecre}
                              />
                            </View>

                            {item?.qty == 0 && (
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
              status={[
                {
                  key: 'Amount',

                  value: `₹ ${item?.amount ? converToString(item?.amount) : 0}`,
                  color: Colors().pending,
                },
              ]}
              rightStatus={
                item?.gst_percent
                  ? [
                      {
                        key: 'Gst %',
                        value: item?.gst_percent,
                        color: Colors().red,
                      },
                    ]
                  : []
              }
            />
          </View>
        );
      })}

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
                formik.setFieldValue(`so_items`, [
                  ...formik?.values?.so_items,
                  {
                    order_line_number: '',
                    hsn_code: '',
                    description: '',
                    name: '',
                    unit: '',
                    change_gst_type: '2',
                    gst_id: '',
                    gst_percent: '',
                    rate: '',
                    qty: '',
                    totalGSTAmount: '',
                    amount: 0,
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
            NEW item
          </Text>
        </View>
      )}
    </View>
  );
};

export default SOItem;

const styles = StyleSheet.create({
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
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

  inputext2: {
    height: 20,
    padding: 1,
    paddingLeft: 5,
    alignSelf: 'center',
    color: Colors().pureBlack,
    justifyContent: 'center',
    flexShrink: 1,
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
  errorMesage: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
});

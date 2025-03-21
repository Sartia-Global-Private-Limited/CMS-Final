/*    ----------------Created Date :: 12- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import IconType from '../../../constants/IconType';
import { useDispatch } from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import { Avatar, Badge } from '@rneui/themed';
import Colors from '../../../constants/Colors';
import { Icon } from '@rneui/base';
import NeumorphicButton from '../../../component/NeumorphicButton';
import * as ImagePicker from 'react-native-image-picker';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { apiBaseUrl } from '../../../../config';
import Images from '../../../constants/Images';
import {
  getAllUnit,
  getItemMasterDropDown,
} from '../../../redux/slices/commonApi';
import ImageViewer from '../../../component/ImageViewer';
import CustomeCard from '../../../component/CustomeCard';
import { Dropdown } from 'react-native-element-dropdown';
import ScreensLabel from '../../../constants/ScreensLabel';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import { getAllSubCategory } from '../../../services/authApi';

const NewFundRequestItem = ({ item, index, formik, type }) => {
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const [allItem, setAllItem] = useState([]);
  const [allUnit, setAllUnit] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);
  const [itemImage, setItemImage] = useState('');

  useEffect(() => {
    fetchAllUnit(), fetchItemData();
    fetchAllSubCategory();
  }, []);

  const selectPhotoTapped = async keyToSet => {
    return Alert.alert(
      // the title of the alert dialog
      'UPLOAD BILL IMAGE',
      // the message you want to show up
      '',
      [
        {
          text: 'cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'upload From Library',
          onPress: () => PhotoTapped('library', keyToSet),
        },
        {
          text: 'capture Photo',
          onPress: () => {
            PhotoTapped('camera', keyToSet);
          },
        },
      ],
    );
  };
  const PhotoTapped = async (type, keyToSet) => {
    if (type == 'camera') {
      if (true) {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true,
          },

          includeBase64: true,
        };

        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let source = {
              type: 'application/png',
              uri: response.assets[0].uri,
            };
            sendImageFunc(response, 'img', keyToSet);
          }
        });
      }
    } else if (type == 'library') {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        // selectionLimit: 10,
        storageOptions: {
          skipBackup: true,
        },
        includeBase64: true,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 80000) {
            sendImageFunc(response, 'img', keyToSet);
          } else {
            Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
          }
        }
      });
    } else if (type == 'pdf') {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: '',
          type: [types.pdf],
          copyTo: 'cachesDirectory',
        });

        if (response[0].size < 800000) {
          this.sendImageFunc(response, 'pdf');
        } else {
          Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const sendImageFunc = async (imageresponse, type, keyToSet) => {
    const imageData = `data:${imageresponse.assets[0].type};base64,${imageresponse.assets[0].base64}`;
    setItemImage(imageData);
    // formik.setFieldValue(keyToSet, imageData);
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

  /*function for fetching unit data data*/
  const fetchAllUnit = async () => {
    try {
      const result = await dispatch(getAllUnit()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));

        setAllUnit(rData);
      } else {
        setAllUnit([]);
      }
    } catch (error) {
      setAllUnit([]);
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
  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(getItemMasterDropDown()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          unique_id: itm?.unique_id,
          rate: itm?.rate,
          hsncode: itm?.hsncode,
          description: itm?.description,
          image: itm?.image,
        }));

        setAllItem(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setAllItem([]);
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

  /*Ui of dropdown list*/
  const renderDropDown2 = item => {
    return (
      <TouchableOpacity
        disabled={false}
        onPress={() => console.log('item preessed')}
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
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
      </TouchableOpacity>
    );
  };
  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'avatarImage':
        const { index, idx } = actionButton?.itemData;

        formik.setFieldValue(
          `request_data.${index}.new_request_fund.${idx}.view_status`,
          true,
        );

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
        formik.values.request_data[index]?.new_request_fund[idx]?.approved_rate, // itm.current_item_price, //fixed value
        `request_data.${index}.new_request_fund.${idx}.approve_fund_amount`,
        formik.setFieldValue,
      );
    } else {
      multipliedPrice(
        returnValue, //change value
        formik.values.request_data[index]?.new_request_fund[idx]?.rate, // itm.current_item_price, //fixed value
        `request_data.${index}.new_request_fund.${idx}.fund_amount`,
        formik.setFieldValue,
      );
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
        <Text style={[styles.title, { color: Colors().pending, fontSize: 16 }]}>
          {`new  stock Request`}
        </Text>
        <SeparatorComponent
          separatorColor={Colors().pending}
          separatorHeight={1}
          separatorWidth={WINDOW_WIDTH * 0.2}
        />
      </View>
      {item?.new_request_fund?.map((itm, idx) => (
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
                    `request_data.${index}.new_request_fund`,
                    formik.values.request_data[index].new_request_fund.filter(
                      (_, i) => i !== idx,
                    ),
                  )
                }
              />
            </View>
          )}
          {itm?.item_image && (
            <CustomeCard
              allData={{ index, idx, itm }}
              avatarImage={itm?.item_image}
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
                          data={allItem.filter(
                            itm =>
                              itm.label.toLowerCase() == newItem.toLowerCase(),
                          )}
                          placeholder={
                            itm?.title?.label ? itm?.title?.label : 'SELECT...'
                          }
                          labelField={'label'}
                          valueField={'value'}
                          value={itm.title}
                          renderItem={renderDropDown2}
                          editable={false}
                          search
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
                          searchPlaceholder="Search..."
                          inputSearchStyle={styles.inputSearchStyle}
                          renderInputSearch={e => (
                            <>
                              <View style={styles.createSkillView}>
                                <TextInput
                                  placeholder="CREATE NEW "
                                  style={[
                                    styles.inputText,
                                    {
                                      // backgroundColor: 'red',
                                      width: WINDOW_WIDTH * 0.5,
                                      color: Colors().pureBlack,
                                    },
                                  ]}
                                  onChangeText={text => {
                                    setNewItem(text);
                                  }}></TextInput>
                                <Icon
                                  name="Safety"
                                  type={IconType.AntDesign}
                                  color={Colors().pureBlack}
                                  onPress={() => {
                                    formik.setFieldValue(
                                      `request_data.${index}.new_request_fund.${idx}.title`,
                                      {
                                        label: newItem,
                                        value: newItem,
                                        __isNew__: true,
                                      },
                                    );
                                  }}
                                />
                              </View>
                            </>
                          )}
                          onChange={val => {
                            formik.setFieldValue(
                              `request_data.${index}.new_request_fund.${idx}.title`,
                              val,
                            );
                          }}
                        />
                      </View>
                      {!itm?.title && (
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
                        Brand :{' '}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Dropdown
                          data={allItem.filter(
                            itm =>
                              itm.label.toLowerCase() == newItem.toLowerCase(),
                          )}
                          placeholder={
                            itm?.brand?.label ? itm?.brand?.label : 'SELECT...'
                          }
                          labelField={'label'}
                          valueField={'value'}
                          value={itm?.brand}
                          renderItem={renderDropDown2}
                          editable={false}
                          search
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
                          searchPlaceholder="Search..."
                          inputSearchStyle={styles.inputSearchStyle}
                          renderInputSearch={e => (
                            <>
                              <View style={styles.createSkillView}>
                                <TextInput
                                  placeholder="CREATE NEW "
                                  style={[
                                    styles.inputText,
                                    {
                                      // backgroundColor: 'red',
                                      width: WINDOW_WIDTH * 0.5,
                                      color: Colors().pureBlack,
                                    },
                                  ]}
                                  onChangeText={text => {
                                    setNewItem(text);
                                  }}></TextInput>
                                <Icon
                                  name="Safety"
                                  type={IconType.AntDesign}
                                  color={Colors().pureBlack}
                                  onPress={() => {
                                    formik.setFieldValue(
                                      `request_data.${index}.new_request_fund.${idx}.brand`,
                                      {
                                        label: newItem,
                                        value: newItem,
                                        __isNew__: true,
                                      },
                                    );
                                  }}
                                />
                              </View>
                            </>
                          )}
                          onChange={val => {
                            formik.setFieldValue(
                              `request_data.${index}.new_request_fund.${idx}.brand`,
                              val,
                            );
                          }}
                        />
                      </View>
                      {!itm?.brand && (
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
                        Sub Category :{' '}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Dropdown
                          data={allSubCategory}
                          placeholder={
                            itm?.sub_category?.label
                              ? itm?.sub_category?.label
                              : 'SELECT...'
                          }
                          labelField={'label'}
                          valueField={'value'}
                          value={itm?.sub_category}
                          renderItem={renderDropDown2}
                          editable={false}
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
                          searchPlaceholder="Search..."
                          onChange={val => {
                            formik.setFieldValue(
                              `request_data.${index}.new_request_fund.${idx}.sub_category`,
                              val,
                            );
                          }}
                        />
                      </View>
                      {!itm?.sub_category && (
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
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}>
                      <Text
                        style={[styles.title, { color: Colors().pureBlack }]}>
                        description :{' '}
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
                        value={itm?.description ? itm?.description : ''}
                        onChangeText={formik.handleChange(
                          `request_data.${index}.new_request_fund.${idx}.description`,
                        )}
                      />
                    </View>
                  ),
                },
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}>
                      <Text
                        style={[styles.title, { color: Colors().pureBlack }]}>
                        hsncode :{' '}
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
                        value={itm?.hsncode ? itm?.hsncode : ''}
                        onChangeText={formik.handleChange(
                          `request_data.${index}.new_request_fund.${idx}.hsncode`,
                        )}
                      />
                    </View>
                  ),
                },
                {
                  component: (
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={[styles.title, { color: Colors().pureBlack }]}>
                          Rate : ₹
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
                          keyboardType="numeric"
                          value={converToString(itm?.rate)}
                          editable={type != 'approve'}
                          onChangeText={txt => {
                            formik.setFieldValue(
                              `request_data.${index}.new_request_fund.${idx}.rate`,
                              txt,
                            ),
                              multipliedPrice(
                                txt,
                                itm?.qty,
                                `request_data.${index}.new_request_fund.${idx}.fund_amount`,
                                formik.setFieldValue,
                              );
                          }}
                        />
                      </View>

                      {type == 'approve' && (
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            request qty :{' '}
                          </Text>
                          <Badge value={itm?.qty} status="primary" />
                        </View>
                      )}
                      {!itm.rate && type != 'approve' && (
                        <View style={{}}>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                          {/* {formik.touched.request_data &&
                                  formik.touched.request_data[index] &&
                                  formik.errors.request_data &&
                                  formik.errors.request_data[index]
                                    ?.request_stock &&
                                  formik.errors.request_data[index]
                                    ?.request_stock[idx]?.request_quantity && (
                                    <Text style={styles.errorMesage}>
                                      {
                                        formik.errors.request_data[index]
                                          ?.request_stock[idx].request_quantity
                                      }
                                    </Text>
                                  )} */}
                        </View>
                      )}
                    </View>
                  ),
                },
                ...(type == 'approve'
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
                              ₹ {itm.fund_amount ? itm.fund_amount : 0}
                            </Text>
                          </View>
                        ),
                      },
                    ]
                  : []),

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
                        unit :{' '}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Dropdown
                          data={allUnit}
                          placeholder={'select...'}
                          labelField={'label'}
                          valueField={'value'}
                          value={itm?.unit_id}
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
                              `request_data.${index}.new_request_fund.${idx}.unit_id`,
                              val,
                            );
                          }}
                        />
                      </View>
                      {!itm?.unit_id && (
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
                ...(type == 'approve'
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
                              Approve Rate : ₹
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
                              value={converToString(itm?.approved_rate)}
                              onSelectionChange={tetx => {
                                multipliedPrice(
                                  tetx?._dispatchInstances?.memoizedProps?.text,
                                  itm.approved_qty,
                                  `request_data.${index}.new_request_fund.${idx}.approve_fund_amount`,
                                  formik.setFieldValue,
                                );
                              }}
                              onChangeText={txt => {
                                formik.setFieldValue(
                                  `request_data.${index}.new_request_fund.${idx}.approved_rate`,
                                  Number(txt) >= Number(itm?.rate)
                                    ? itm?.rate
                                    : txt,
                                );
                              }}
                            />
                            {!itm.approved_rate && type == 'approve' && (
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
                          {type == 'approve' ? 'approve qty : ' : 'qty. : '}
                        </Text>
                        <IncreDecreComponent
                          defaultValue={
                            type == 'approve'
                              ? itm?.approved_qty || 0
                              : itm?.qty || 0
                          }
                          MaxValue={type == 'approve' ? itm?.qty : +Infinity}
                          formik={formik}
                          keyToSet={
                            type == 'approve'
                              ? `request_data.${index}.new_request_fund.${idx}.approved_qty`
                              : `request_data.${index}.new_request_fund.${idx}.qty`
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
              ]}
              status={
                itm?.item_image
                  ? [
                      {
                        key: type == 'approve' ? 'Approve Fund' : 'Fund Amount',

                        value:
                          type == 'approve'
                            ? `₹ ${
                                itm.approve_fund_amount
                                  ? converToString(itm.approve_fund_amount)
                                  : 0
                              }`
                            : `₹ ${
                                itm?.fund_amount
                                  ? converToString(itm?.fund_amount)
                                  : 0
                              }`,
                        color: Colors().pending,
                      },
                    ]
                  : null
              }
              rightStatus={
                type === 'approve' && !itm.view_status
                  ? [
                      {
                        // key: '',
                        value: 'Image Viewed',
                        color: Colors().red,
                      },
                    ]
                  : []
              }
              action={handleAction}
            />
          )}
        </View>
      ))}
      {formik.values.request_data[index].new_request_fund.length > 0 &&
        type != 'approve' && (
          <View style={{ flexDirection: 'row', marginLeft: 30 }}>
            <Text style={[styles.title, { color: Colors().purple }]}>
              TOTAL Fund Amount ₹{' '}
              {getTotal(
                formik.values.request_data[index].new_request_fund,
                'fund_amount',
              )}
            </Text>
          </View>
        )}

      {formik.values.request_data[index].new_request_fund.length > 0 &&
        type == 'approve' && (
          <View style={{ flexDirection: 'row', marginLeft: 30 }}>
            <Text style={[styles.title, { color: Colors().purple }]}>
              TOTAL Approve Fund ₹{' '}
              {getTotal(
                formik.values.request_data[index].new_request_fund,
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
              onPress={() => setVisible(true)}
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
      {visible && (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  { backgroundColor: Colors().screenBackground },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.modalImage,
                    { backgroundColor: Colors().inputDarkShadow },
                  ]}
                  onPress={() => selectPhotoTapped()}>
                  {!itemImage && (
                    <Icon
                      style={{ alignSelf: 'center', marginTop: 10 }}
                      name={'image'}
                      type={IconType.EvilIcons}
                      size={80}
                      color={Colors().gray2}
                    />
                  )}
                  {itemImage && (
                    <Image
                      style={{
                        height: 100,
                        width: 350,
                        borderRadius: 8,
                      }}
                      source={{ uri: itemImage }}></Image>
                  )}
                </TouchableOpacity>
                {!itemImage && (
                  <Text style={styles.errorMesage}>{`Image is required`}</Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 50,
                    marginTop: 15,
                  }}>
                  <NeumorphicButton
                    title={label.CANCEL}
                    titleColor={Colors().red}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => {
                      setVisible(false), setItemImage('');
                    }}
                  />

                  <NeumorphicButton
                    title={label.SAVE}
                    titleColor={Colors().aprroved}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    disabled={!itemImage}
                    onPress={() => {
                      formik.setFieldValue(
                        `request_data.${index}.new_request_fund`,
                        [
                          ...formik.values.request_data[index].new_request_fund,
                          {
                            unit_id: '',
                            description: '',
                            item_image: itemImage,
                            title: '',
                            rate: '',
                            qty: '',
                            transfer_quantity: '',
                            fund_amount: '',
                            hsncode: '',
                          },
                        ],
                      );
                      setVisible(false);
                      setItemImage('');
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
        />
      )}
    </View>
  );
};

export default NewFundRequestItem;

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
  modalImage: {
    borderRadius: 8,
    borderColor: Colors().pureBlack,
    height: 100,
    width: 350,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,

    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // rowGap: 8,
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
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 12,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  createSkillView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
  },
});

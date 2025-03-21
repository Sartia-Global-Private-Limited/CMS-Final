/*    ----------------Created Date :: 28- Feb -2024   ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import Colors from '../../constants/Colors';
import SeparatorComponent from '../../component/SeparatorComponent';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import { addSupplierSchema } from '../../utils/FormSchema';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphCard from '../../component/NeumorphCard';
import { Icon, ListItem } from '@rneui/base';
import { useDispatch } from 'react-redux';
import { getAllBank, getAllStateList } from '../../redux/slices/commonApi';
import AlertModal from '../../component/AlertModal';

import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import {
  addSupplier,
  updateSuppliers,
} from '../../redux/slices/suppliers/addUpdateSupplier';
import Toast from 'react-native-toast-message';
import { getSupplierDetailById } from '../../redux/slices/suppliers/getSupplierDetailSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import { apiBaseUrl } from '../../../config';
import Fileupploader from '../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageViewer from '../../component/ImageViewer';
import DropDownItem from '../../component/DropDownItem';
import { store } from '../../redux/store';

const AddUpdateSuplierScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const { isDarkMode } = store.getState().getDarkMode;
  const [edit, setEdit] = useState({});
  const [allBank, setAllBank] = useState([]);
  const [allState, setAllState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const refRBSheet = useRef(RBSheet);

  useEffect(() => {
    fetchBankData();
    fetchStateData();

    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      supplier_name: edit?.supplier_name || '',
      owner_name: edit?.owner_name || '',
      cashier_name: edit?.cashier_name || '',

      bank_id: edit_id ? edit?.bank_id : '',
      account_holder_name: edit?.account_holder_name || '',
      account_number: edit_id ? JSON.stringify(edit?.account_number) : '',
      branch_name: edit?.branch_name || '',
      ifsc_code: edit?.ifsc_code || '',
      upi_id: edit?.upi_id || '',
      upi_image: edit?.upi_image || '',
      address: edit?.supplier_addresses || [
        {
          shop_office_number: '',
          street_name: '',
          city: '',
          state: '',
          pin_code: '',
          landmark: '',
          gst_number: '',
          is_default: '1',
        },
      ],
    },
    validationSchema: addSupplierSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      supplier_name: values?.supplier_name,
      owner_name: values?.owner_name,
      cashier_name: values?.cashier_name,

      bank_id: values?.bank_id,
      account_holder_name: values?.account_holder_name,
      account_number: parseInt(values?.account_number),
      branch_name: values?.branch_name,
      ifsc_code: values?.ifsc_code,
      upi_id: values?.upi_id,
      upi_image:
        edit_id && typeof values?.upi_image == 'string'
          ? values?.upi_image
          : `data:image/jpeg;base64,${values?.upi_image?.base64}`,
      address: values?.address,
    };
    if (edit.id) {
      sData['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(
            updateSuppliers({ id: edit_id, reqBody: sData }),
          ).unwrap()
        : await dispatch(addSupplier(sData)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.goBack();
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

  /*function for fetching team data*/
  const fetchBankData = async () => {
    try {
      const result = await dispatch(getAllBank()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.bank_name,
          value: itm?.id,
          image: itm?.logo,
        }));

        setAllBank(rData);
      } else {
        setAllBank([]);
      }
    } catch (error) {
      setAllBank([]);
    }
  };

  /*function for fetching state data*/
  const fetchStateData = async () => {
    try {
      const result = await dispatch(getAllStateList()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.name,
        }));

        setAllState(rData);
      } else {
        setAllState([]);
      }
    } catch (error) {
      setAllState([]);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getSupplierDetailById(edit_id)).unwrap();

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
    { title: 'BANK DETAILS', content: 'Content for Item 3' },
    { title: 'Suppliers Addresses', content: 'Content for Item 4' },
  ];

  const handlePress = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getFormError = (errors, index) => {
    let indexArray = [];

    if (
      errors.supplier_name ||
      errors.cashier_name ||
      errors.owner_name ||
      errors.supplier_code
    ) {
      indexArray.push(0);
    }
    if (
      errors.bank_id ||
      errors.branch_name ||
      errors.account_holder_name ||
      errors.account_number ||
      errors.ifsc_code
    ) {
      indexArray.push(1);
    }

    if (errors.address) {
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
            ? `${label.SUPPLIERS} ${label.UPDATE}`
            : `${label.SUPPLIERS} ${label.ADD}`
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
                            style={{
                              marginLeft: 10,
                            }}
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
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={[styles.title, { color: Colors().pureBlack }]}>
                        SUPPLIER name{' '}
                      </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>
                    <NeumorphicTextInput
                      placeHolderTxt={'TYPE...'}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.supplier_name}
                      onChangeText={formik.handleChange('supplier_name')}
                      style={[styles.inputText, { color: Colors().pureBlack }]}
                    />
                    {formik.touched.supplier_name &&
                      formik.errors.supplier_name && (
                        <Text style={styles.errorMesage}>
                          {formik.errors.supplier_name}
                        </Text>
                      )}

                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={[styles.title, { color: Colors().pureBlack }]}>
                        CASHIER NAME{' '}
                      </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>
                    <NeumorphicTextInput
                      placeHolderTxt={'TYPE...'}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.cashier_name}
                      onChangeText={formik.handleChange('cashier_name')}
                      style={[styles.inputText, { color: Colors().pureBlack }]}
                    />
                    {formik.touched.cashier_name &&
                      formik.errors.cashier_name && (
                        <Text style={styles.errorMesage}>
                          {formik.errors.cashier_name}
                        </Text>
                      )}

                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={[styles.title, { color: Colors().pureBlack }]}>
                        OWNER NAME{' '}
                      </Text>
                      <Icon
                        name="asterisk"
                        type={IconType.FontAwesome5}
                        size={8}
                        color={Colors().red}
                      />
                    </View>
                    <NeumorphicTextInput
                      placeHolderTxt={'TYPE...'}
                      width={WINDOW_WIDTH * 0.92}
                      value={formik.values.owner_name}
                      onChangeText={formik.handleChange('owner_name')}
                      style={[styles.inputText, { color: Colors().pureBlack }]}
                    />
                    {formik.touched.owner_name && formik.errors.owner_name && (
                      <Text style={styles.errorMesage}>
                        {formik.errors.owner_name}
                      </Text>
                    )}
                  </View>
                </ListItem.Content>
              )}

              {/*view for bank details*/}
              {index == 1 && (
                <ListItem.Content style={{ rowGap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      bANK NAME{' '}
                    </Text>
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
                    placeholder={'SELECT ...'}
                    data={allBank}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values.bank_id}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    activeColor={Colors().skyBule}
                    placeholderStyle={[
                      styles.inputText,
                      { color: Colors().pureBlack },
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      { color: Colors().pureBlack },
                    ]}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                    containerStyle={{
                      backgroundColor: Colors().inputLightShadow,
                    }}
                    onChange={val => {
                      formik.setFieldValue(`bank_id`, val.value);
                    }}
                  />
                  {formik.touched.bank_id && formik.errors.bank_id && (
                    <Text style={styles.errorMesage}>
                      {formik.errors.bank_id}
                    </Text>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      Account holder name{' '}
                    </Text>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                  <NeumorphicTextInput
                    placeHolderTxt={'TYPE...'}
                    width={WINDOW_WIDTH * 0.92}
                    value={formik.values.account_holder_name}
                    onChangeText={formik.handleChange('account_holder_name')}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                  />
                  {formik.touched.account_holder_name &&
                    formik.errors.account_holder_name && (
                      <Text style={styles.errorMesage}>
                        {formik.errors.account_holder_name}
                      </Text>
                    )}

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      Branch name{' '}
                    </Text>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                  <NeumorphicTextInput
                    placeHolderTxt={'TYPE...'}
                    width={WINDOW_WIDTH * 0.92}
                    value={formik.values.branch_name}
                    onChangeText={formik.handleChange('branch_name')}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                  />
                  {formik.touched.branch_name && formik.errors.branch_name && (
                    <Text style={styles.errorMesage}>
                      {formik.errors.branch_name}
                    </Text>
                  )}

                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={[styles.title, { color: Colors().pureBlack }]}>
                          Account NO.{' '}
                        </Text>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        placeholder={'TYPE...'}
                        style={[
                          styles.inputText,
                          { color: Colors().pureBlack },
                        ]}
                        value={formik.values.account_number}
                        keyboardType="number-pad"
                        // maxLength={10}
                        onChangeText={formik.handleChange('account_number')}
                      />

                      {formik.touched.account_number &&
                        formik.errors.account_number && (
                          <Text style={styles.errorMesage}>
                            {formik.errors.account_number}
                          </Text>
                        )}
                    </View>
                    <View style={styles.rightView}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={[styles.title, { color: Colors().pureBlack }]}>
                          ifsc code.{' '}
                        </Text>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        placeholder={'TYPE...'}
                        style={[
                          styles.inputText,
                          { color: Colors().pureBlack },
                        ]}
                        value={formik.values.ifsc_code}
                        // keyboardType="number-pad"
                        // maxLength={12}
                        onChangeText={formik.handleChange('ifsc_code')}
                      />
                      {formik.touched.ifsc_code && formik.errors.ifsc_code && (
                        <Text style={styles.errorMesage}>
                          {formik.errors.ifsc_code}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: Colors().pureBlack }]}>
                      Upi id{' '}
                    </Text>
                    {/* <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    /> */}
                  </View>
                  <NeumorphicTextInput
                    placeHolderTxt={'TYPE...'}
                    width={WINDOW_WIDTH * 0.92}
                    value={formik.values.upi_id}
                    onChangeText={formik.handleChange('upi_id')}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                  />

                  {formik?.values?.upi_image && (
                    <View>
                      <View style={styles.crossIcon}>
                        <Icon
                          name="close"
                          color={Colors().lightShadow}
                          type={IconType.AntDesign}
                          size={15}
                          onPress={() => formik.setFieldValue(`upi_image`, '')}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <Text
                          style={[styles.title, { color: Colors().pureBlack }]}>
                          QR image :{' '}
                        </Text>
                        <TouchableOpacity
                          style={{ alignSelf: 'center' }}
                          onPress={() => {
                            setImageModalVisible(true);

                            setImageUri(
                              edit_id &&
                                typeof formik?.values?.upi_image == 'string'
                                ? `${apiBaseUrl}${formik?.values?.upi_image}`
                                : `${formik?.values?.upi_image?.uri}`,
                            );
                          }}>
                          <Image
                            source={{
                              uri:
                                edit_id &&
                                typeof formik?.values?.upi_image == 'string'
                                  ? `${apiBaseUrl}${formik?.values?.upi_image}`
                                  : `${formik?.values?.upi_image?.uri}`,
                            }}
                            style={[styles.Image, { marginTop: 10 }]}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {!formik.values.upi_image && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginTop: 30,
                      }}>
                      <NeumorphCard
                        lightShadowColor={Colors().darkShadow2}
                        darkShadowColor={Colors().lightShadow}>
                        <Icon
                          name="plus"
                          type={IconType.AntDesign}
                          color={Colors().aprroved}
                          style={styles.actionIcon}
                          onPress={() => refRBSheet.current.open()}
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
                        QR Image
                      </Text>
                    </View>
                  )}

                  <Fileupploader
                    btnRef={refRBSheet}
                    cameraOption={{ base64: true, multiselet: false }}
                    cameraResponse={item => {
                      formik.setFieldValue(`upi_image`, item);
                      refRBSheet.current.close();
                    }}
                    galleryOption={{ base64: true, multiselet: false }}
                    galleryResponse={item => {
                      formik.setFieldValue(`upi_image`, item);
                      refRBSheet.current.close();
                    }}
                  />
                  {imageModalVisible && (
                    <ImageViewer
                      visible={imageModalVisible}
                      imageUri={imageUri}
                      cancelBtnPress={() =>
                        setImageModalVisible(!imageModalVisible)
                      }
                    />
                  )}
                </ListItem.Content>
              )}
              {/*view for Addresses details*/}
              {index == 2 && (
                <>
                  {formik.values.address.map((item1, index1) => (
                    <View key={index1}>
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
                            {index1 >= 0 ? `Address ${index1 + 1}` : `Address`}
                          </Text>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.3}
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
                                    formik.setFieldValue(`address`, [
                                      ...formik.values.address,
                                      {
                                        shop_office_number: '',
                                        street_name: '',
                                        city: '',
                                        state: '',
                                        pin_code: '',
                                        landmark: '',
                                        gst_number: '',
                                        is_default: '0',
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
                                      `address`,
                                      formik.values.address.filter(
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

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            SHOP/OFFICE NUMBER{' '}
                          </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.92}
                          value={item1.shop_office_number}
                          onChangeText={formik.handleChange(
                            `address.${index1}.shop_office_number`,
                          )}
                          style={[
                            styles.inputText,
                            { color: Colors().pureBlack },
                          ]}
                        />
                        {formik.touched.address &&
                          formik.touched.address[index1] &&
                          formik.errors.address &&
                          formik.errors.address[index1]?.shop_office_number && (
                            <Text style={styles.errorMesage}>
                              {formik.errors.address[index1].shop_office_number}
                            </Text>
                          )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            street name{' '}
                          </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.92}
                          value={item1.street_name}
                          onChangeText={formik.handleChange(
                            `address.${index1}.street_name`,
                          )}
                          style={[
                            styles.inputText,
                            { color: Colors().pureBlack },
                          ]}
                        />
                        {formik.touched.address &&
                          formik.touched.address[index1] &&
                          formik.errors.address &&
                          formik.errors.address[index1]?.street_name && (
                            <Text style={styles.errorMesage}>
                              {formik.errors.address[index1].street_name}
                            </Text>
                          )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            city{' '}
                          </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.92}
                          value={item1.city}
                          onChangeText={formik.handleChange(
                            `address.${index1}.city`,
                          )}
                          style={[
                            styles.inputText,
                            { color: Colors().pureBlack },
                          ]}
                        />
                        {formik.touched.address &&
                          formik.touched.address[index1] &&
                          formik.errors.address &&
                          formik.errors.address[index1]?.city && (
                            <Text style={styles.errorMesage}>
                              {formik.errors.address[index1].city}
                            </Text>
                          )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            State{' '}
                          </Text>
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
                          placeholder={'SELECT ...'}
                          data={allState}
                          labelField={'label'}
                          valueField={'value'}
                          value={item1.state}
                          renderItem={item => (
                            <DropDownItem item={item}></DropDownItem>
                          )}
                          activeColor={Colors().skyBule}
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
                              `address.${index1}.state`,
                              val.value,
                            );
                          }}
                        />

                        {formik.touched.address &&
                          formik.touched.address[index1] &&
                          formik.errors.address &&
                          formik.errors.address[index1]?.state && (
                            <Text style={styles.errorMesage}>
                              {formik.errors.address[index1].state}
                            </Text>
                          )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().pureBlack },
                            ]}>
                            Landmark{' '}
                          </Text>
                          <Icon
                            name="asterisk"
                            type={IconType.FontAwesome5}
                            size={8}
                            color={Colors().red}
                          />
                        </View>
                        <NeumorphicTextInput
                          placeHolderTxt={'TYPE...'}
                          width={WINDOW_WIDTH * 0.92}
                          value={item1.landmark}
                          onChangeText={formik.handleChange(
                            `address.${index1}.landmark`,
                          )}
                          style={[
                            styles.inputText,
                            { color: Colors().pureBlack },
                          ]}
                        />
                        {formik.touched.address &&
                          formik.touched.address[index1] &&
                          formik.errors.address &&
                          formik.errors.address[index1]?.landmark && (
                            <Text style={styles.errorMesage}>
                              {formik.errors.address[index1].landmark}
                            </Text>
                          )}

                        <View style={styles.twoItemView}>
                          <View style={styles.leftView}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                pincode{' '}
                              </Text>
                              <Icon
                                name="asterisk"
                                type={IconType.FontAwesome5}
                                size={8}
                                color={Colors().red}
                              />
                            </View>
                            <NeumorphicTextInput
                              width={WINDOW_WIDTH * 0.42}
                              placeholder={'TYPE...'}
                              style={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              value={
                                edit_id && typeof item1.pin_code == 'number'
                                  ? JSON.stringify(item1.pin_code)
                                  : item1.pin_code
                              }
                              keyboardType="number-pad"
                              maxLength={6}
                              onChangeText={formik.handleChange(
                                `address.${index1}.pin_code`,
                              )}
                            />
                            {formik.touched.address &&
                              formik.touched.address[index1] &&
                              formik.errors.address &&
                              formik.errors.address[index1]?.pin_code && (
                                <Text style={styles.errorMesage}>
                                  {formik.errors.address[index1].pin_code}
                                </Text>
                              )}
                          </View>
                          <View style={styles.rightView}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                gst number{' '}
                              </Text>
                              <Icon
                                name="asterisk"
                                type={IconType.FontAwesome5}
                                size={8}
                                color={Colors().red}
                              />
                            </View>
                            <NeumorphicTextInput
                              width={WINDOW_WIDTH * 0.42}
                              placeholder={'TYPE...'}
                              style={[
                                styles.inputText,
                                { color: Colors().pureBlack },
                              ]}
                              value={item1.gst_number}
                              // keyboardType="number-pad"
                              // maxLength={10}
                              onChangeText={formik.handleChange(
                                `address.${index1}.gst_number`,
                              )}
                            />
                            {formik.touched.address &&
                              formik.touched.address[index1] &&
                              formik.errors.address &&
                              formik.errors.address[index1]?.gst_number && (
                                <Text style={styles.errorMesage}>
                                  {formik.errors.address[index1].gst_number}
                                </Text>
                              )}
                          </View>
                        </View>

                        <View style={styles.checkboxView}>
                          <NeumorphicCheckbox
                            isChecked={item1.is_default == '1' ? true : false}
                            onChange={e => {
                              const updatedAddresses =
                                formik.values.address.map((address, idx) => {
                                  if (idx === index1) {
                                    // Set the current address as default
                                    return { ...address, is_default: '1' };
                                  } else {
                                    // Set all other addresses as not default
                                    return { ...address, is_default: '0' };
                                  }
                                });

                              formik.setFieldValue('address', updatedAddresses);
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
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
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

export default AddUpdateSuplierScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
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
    right: -11,
    top: 0,
    zIndex: 1,
    justifyContent: 'center',
  },
  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    margin: 8,
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
});

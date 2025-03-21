/*    ----------------Created Date :: 6- August -2024   ----------------- */
import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import ScreensLabel from '../../../constants/ScreensLabel';
import {addItemSchema} from '../../../utils/FormSchema';
import CreateItemForm from './CreateItemForm';
import {
  addItemMasterItem,
  updateItemMasterItem,
} from '../../../redux/slices/item master/item master/addUpdateItemMasterListSlice';
import {getItemMastertDetailById} from '../../../redux/slices/item master/item master/getItemMasterDetailSlice';

const AddUpdateAssestScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      name: edit?.name || '',
      supplier_id: edit?.supplier_id || '',
      hsncode: edit?.hsncode || '',
      rucode: edit?.rucode || '',
      item_unique_id: edit?.unique_id || '',
      unit_id: edit?.unit_id || '',
      description: edit?.description || '',
      category: edit?.category || '',
      image: edit?.image || null,
      rates: edit?.rates
        ? edit?.rates.map(itm => {
            return {
              brand: itm?.brand,
              brand_id: itm?.item_rates_id,
              rate: itm?.rate,
            };
          })
        : [{brand: '', brand_id: '', rate: ''}],
    },
    validationSchema: addItemSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('supplier_id', values?.supplier_id);
    formData.append('hsncode', values?.hsncode);
    formData.append('rucode', values?.rucode);
    formData.append('item_unique_id', values?.item_unique_id);
    formData.append('category', values?.category);
    formData.append('unit_id', values?.unit_id);
    formData.append('description', values?.description);
    formData.append('rates', JSON.stringify(values?.rates));
    formData.append('image', values?.image);

    if (edit_id) {
      formData.append('id', edit_id);
    }
    // return console.log('formdata', formData);

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateItemMasterItem(formData)).unwrap()
        : await dispatch(addItemMasterItem(formData)).unwrap();

      console.log('res', res);
      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setUpdateModalVisible(false);
        resetForm();
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setUpdateModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
      setUpdateModalVisible(false);
    }
  };

  /*fucntion for fetching detail of measurement*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getItemMastertDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult?.data);
    } else {
      setEdit([]);
    }
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
            ? `${label.ITEM} ${label.UPDATE}`
            : `${label.ITEM} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CreateItemForm
            formik={formik}
            type={type}
            edit_id={edit_id}
            edit={edit}
          />

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

          <View
            style={{
              justifyContent: 'center',
              marginVertical: 20,
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
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

export default AddUpdateAssestScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});

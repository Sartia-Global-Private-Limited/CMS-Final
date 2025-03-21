import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useFormik } from 'formik';

import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import {
  getAllCompliant,
  getAllOutletList,
  getAllUsers,
} from '../../redux/slices/commonApi';
import {
  addEarthingTesting,
  updateEarthingTesting,
} from '../../redux/slices/earthing testing/addUpdateETSlice';
import { getETDetailById } from '../../redux/slices/earthing testing/getETDetailSlice';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import moment from 'moment';
import MultiSelectComponent from '../../component/MultiSelectComponent';
import { addEarthingTestingSchema } from '../../utils/FormSchema';

const AddUpdateETScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [allComplaint, setAllComplaint] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllComplaintList();
    fetchAllOutletList();
    fetchAlluserList();
    if (edit_id) {
      fetchSingleData();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      complaint_id: edit?.complaint_id || '',
      outlet_id: edit?.outlet_id
        ? JSON.parse(edit?.outlet_id.replace(/\\/g, '').replace(/"/g, ''))
        : [],

      user_id: edit?.user_id
        ? JSON.parse(edit?.user_id.replace(/\\/g, '').replace(/"/g, ''))
        : [],
      expire_date: edit?.expire_date || '',
    },
    validationSchema: addEarthingTestingSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    if (edit_id) {
      values['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateEarthingTesting(values)).unwrap()
        : await dispatch(addEarthingTesting(values)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('AllETListScreen');
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

  const fetchSingleData = async () => {
    const res = await dispatch(getETDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  /* fetch Document category list  */
  const fetchAllComplaintList = async () => {
    const res = await dispatch(getAllCompliant()).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.complaints,
        };
      });
      setAllComplaint(rData);
    } else {
      setAllComplaint([]);
    }
  };
  /* fetch all role list  */
  const fetchAllOutletList = async () => {
    const res = await dispatch(getAllOutletList()).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.outlet_id,
          label: item?.outlet,
        };
      });
      setAllOutlet(rData);
    } else {
      setAllOutlet([]);
    }
  };

  /* fetch all user  list  */
  const fetchAlluserList = async id => {
    const res = await dispatch(getAllUsers()).unwrap();
    // if (edit.user_type !== id) {
    //   formik.setFieldValue(`user_id`, '');
    // }
    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.name,
          image: item?.image,
        };
      });
      setAllUser(rData);
    } else {
      Toast.show({
        type: 'error',
        text1: res?.message,
        position: 'bottom',
      });
      setAllUser([]);
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
          edit_id ? 'update Earthing testing' : 'add Earthing testing'
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.title, { fontSize: 16, marginBottom: 10 }]}>
              Earthing Testing Details
            </Text>
          </View>
          <NeumorphicDropDownList
            title={'COmplaint'}
            required={true}
            data={allComplaint}
            value={formik?.values?.complaint_id}
            onChange={val => {
              formik.setFieldValue(`complaint_id`, val.value);
            }}
            errorMessage={formik?.errors?.complaint_id}
          />

          <MultiSelectComponent
            required={true}
            value={formik?.values?.outlet_id}
            onChange={item => {
              formik.setFieldValue(`outlet_id`, item);
            }}
            inside={true}
            errorMessage={formik?.errors?.outlet_id}
            title={'Outlet'}
            data={allOutlet}
          />
          <MultiSelectComponent
            title={'user'}
            required={true}
            value={formik?.values?.user_id}
            onChange={item => {
              formik.setFieldValue(`user_id`, item);
            }}
            inside={true}
            errorMessage={formik?.errors?.user_id}
            data={allUser}
          />

          <NeumorphDatePicker
            title={'Expiry Date'}
            withoutShadow={true}
            iconPress={() => setExpiryDate(!expiryDate)}
            valueOfDate={
              formik?.values?.expire_date
                ? moment(formik?.values?.expire_date, 'YYYY/MM/DD').format(
                    'DD/MM/YYYY',
                  )
                : ''
            }
            modal
            open={expiryDate}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              formik.setFieldValue(
                `expire_date`,
                moment(date).format('YYYY/MM/DD'),
              );
              setExpiryDate(false);
            }}
            onCancel={() => {
              setExpiryDate(false);
            }}
            errorMessage={formik?.errors?.expire_date}
          />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateETScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },

  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },

  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  btnView: {
    alignSelf: 'center',
    // marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
});

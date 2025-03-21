/*    ----------------Created Date :: 13- sep -2024    ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { getAllUsers } from '../../../redux/slices/commonApi';
import CustomeHeader from '../../../component/CustomeHeader';
import WebView from 'react-native-webview';
import { getEmployeeTracking } from '../../../services/authApi';
import DataNotFound from '../../../component/DataNotFound';

const TrackingMapViewSreen = ({ route }) => {
  const edit = route?.params?.editData;
  const [allUser, setAllUser] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllUser();
  }, []);

  const [trackingData, setTrackingData] = useState([]);

  const fetchEmployeeHistory = async user_id => {
    const res = await getEmployeeTracking(user_id);
    if (res.status) {
      setTrackingData(res.data);
    } else {
      setTrackingData([]);
    }
  };

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: edit?.user_id ? edit?.user_id : '',
    },
    // validationSchema: addLoanSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });
  const handleSubmit = () => {};

  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllUser(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllUser([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllUser([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text
            numberOfLines={1}
            style={[styles.inputText, { marginLeft: 10 }]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  const iframeHTML = `
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d56044.409394520524!2d77.35084839999999!3d28.6065084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1672737497425!5m2!1sen!2sin" 
    width="100%" 
    height="100%" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
`;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={'EMPLOYEE TRACKING'} />

      <View style={styles.inpuntContainer}>
        <View style={{ rowGap: 2 }}>
          <Text style={styles.title}>User name</Text>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.95}
            RightIconName="caretdown"
            RightIconType={IconType.AntDesign}
            RightIconColor={Colors().darkShadow2}
            placeholder={'SELECT ...'}
            data={allUser}
            labelField={'label'}
            valueField={'value'}
            value={formik.values.user_id}
            renderItem={renderDropDown}
            search={false}
            placeholderStyle={styles.inputText}
            selectedTextStyle={styles.selectedTextStyle}
            editable={false}
            style={styles.inputText}
            onChange={val => {
              fetchEmployeeHistory(val.value);
              formik.setFieldValue(`user_id`, val.value);
            }}
          />
        </View>
        {formik.touched.user_id && formik.errors.user_id && (
          <Text style={styles.errorMesage}>{formik.errors.user_id}</Text>
        )}
      </View>
      <View
        style={{
          width: WINDOW_WIDTH * 0.95,
          alignSelf: 'center',
          height: WINDOW_HEIGHT * 0.3,
        }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: iframeHTML }}
          style={styles.webview}
        />
      </View>

      <View>
        <Text
          style={{
            padding: 15,
            fontSize: 18,
            fontWeight: '600',
            color: Colors().purple,
            fontFamily: Colors().fontFamilyBookMan,
          }}>
          Location History
        </Text>
        <ScrollView>
          {trackingData?.length > 0 ||
          trackingData == null ||
          trackingData == undefined ? (
            <View
              style={{
                width: WINDOW_WIDTH,
                height: WINDOW_HEIGHT * 0.35,
              }}>
              <DataNotFound />
            </View>
          ) : (
            trackingData?.map(item => (
              <CustomeCard
                avatarImage={item?.image}
                allData={item}
                data={[
                  {
                    key: 'Remarks',
                    value: item?.remarks ?? '--',
                  },
                  {
                    key: 'latitude ',
                    value: item?.latitude ?? '--',
                  },
                  {
                    key: 'longitude',
                    value: item?.longitude ?? '--',
                  },
                ]}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TrackingMapViewSreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  webview: {
    flex: 1,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    color: Colors().pureBlack,
  },

  inputText: {
    color: Colors().pureBlack,
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
  },
  dropdown: {
    marginLeft: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

/*    ----------------Created Date :: 18- May -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ScreensLabel from '../../../constants/ScreensLabel';
import IconType from '../../../constants/IconType';
import Images from '../../../constants/Images';

import SiteStockInspectionItemList from './SiteStockInspectionItemList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { useFormik } from 'formik';
import InspectionFeedbackForm from '../../../component/InspectionFeedbackForm';
import { approveSiteStockInspection } from '../../../redux/slices/site-inspection/site-stock-inspection/approveSiteStockInspectionSlice';
import {
  getApprovedSiteStockInspectionDetail,
  getPartialSiteStockInspectionDetail,
  getPendingSiteStockInspectionDetail,
} from '../../../redux/slices/site-inspection/site-stock-inspection/getSiteStockInspectionDetailSlice';

const SiteStockInspectionDetailScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;
  const purpose = route?.params?.purpose;

  const outletId = route?.params?.outletId;
  const month = route?.params?.month;
  const monthNumber = month.split('-');
  const [showTable, setShowTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSiteStockInspectionDetail);
  const edit = ListData?.data?.data;

  const outletName = ListData?.data?.data[0]?.outletDetails
    ? ListData?.data?.data[0]?.outletDetails[0]?.outlet_name
    : '----';
  const outletUniqueId = ListData?.data?.data[0]?.outletDetails
    ? ListData?.data?.data[0]?.outletDetails[0]?.outlet_unique_id
    : '----';

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      users: edit || '',
      area_manager: '',
      supervisor: '',
      end_users: '',
      outlet_honor_name: '',
      contact_number: '',
      remarks: '',
    },
    // validationSchema:
    //   type === 'approve' ? approveExpensePunchSchema : addExpensePunchSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    let approve_stock_punch = [];
    let office_not_approved = [];

    {
      values.users.forEach(element => {
        if (element.user_select) {
          element?.itemDetails?.forEach(itm => {
            approve_stock_punch.push({
              approve_office_qty: itm?.approve_office_qty || 0,
              id: itm?.id,
              stock_id: itm?.stock_id,
            });
          });
        } else {
          element?.itemDetails?.forEach(itm => {
            office_not_approved.push({
              id: itm?.id,
              stock_id: itm?.stock_id,
            });
          });
        }
      });
    }

    const sData = {
      approve_stock_punch: approve_stock_punch,
      office_not_approved: office_not_approved,
      office_details: {
        area_manager: values?.area_manager,
        supervisor: values?.supervisor,
        end_users: values?.end_users,
        remarks: values?.remarks,
        outlet_honor_name: values?.outlet_honor_name,
        contact_number: values?.contact_number,
        office_inspection_for: 0,
      },
    };

    try {
      setLoading(true);
      const res = await dispatch(approveSiteStockInspection(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        resetForm();
        navigation.navigate('SiteStockInspectionTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (type == 'pending') {
      dispatch(
        getPendingSiteStockInspectionDetail({
          outletId: outletId,
          month: monthNumber[1],
        }),
      );
    }
    if (type == 'partial') {
      dispatch(
        getPartialSiteStockInspectionDetail({
          outletId: outletId,
          month: monthNumber[1],
        }),
      );
    }
    if (type == 'approved') {
      dispatch(
        getApprovedSiteStockInspectionDetail({
          outletId: outletId,
          month: monthNumber[1],
        }),
      );
    }
  }, [type]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      if (type == 'pending') {
        dispatch(
          getPendingSiteStockInspectionDetail({
            outletId: outletId,
            month: monthNumber[1],
          }),
        );
      }
      if (type == 'partial') {
        dispatch(
          getPartialSiteStockInspectionDetail({
            outletId: outletId,
            month: monthNumber[1],
          }),
        );
      }

      if (type == 'approved') {
        dispatch(
          getApprovedSiteStockInspectionDetail({
            outletId: outletId,
            month: monthNumber[1],
          }),
        );
      }

      setRefreshing(false);
    }, 2000);
  }, []);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    const { index } = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        formik.setFieldValue(`users.${index}.user_select`, true);
        setShowTable(prevState => {
          // Initialize the state if it's empty or the index is out of bounds
          const newState = [...prevState];
          if (newState.length <= index) {
            for (let i = newState.length; i <= index; i++) {
              newState.push(false);
            }
          }
          // Reverse the value of the given index
          newState[index] = !newState[index];
          // If remaining indices are true, make them false
          for (let i = 0; i < newState.length; i++) {
            if (i !== index && newState[i] === true) {
              newState[i] = false;
            }
          }
          return newState;
        });
        break;

      default:
        break;
    }
  };

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <CustomeCard
          allData={{ item, index, showTable }}
          avatarImage={item?.userDetails && item?.userDetails[0]?.image}
          data={[
            {
              key: 'Employee id',
              value:
                (item?.userDetails && item?.userDetails[0]?.employee_id) ||
                '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Employee name',
              value:
                (item?.userDetails && item?.userDetails[0]?.username) || '--',
            },
            {
              key: 'Complaint id',
              value:
                (item?.itemDetails &&
                  item?.itemDetails[0]?.complaint_unique_id) ||
                '--',
              keyColor: Colors().pending,
            },
          ]}
          status={[
            {
              key: 'action',
              value: 'item list ',
            },
          ]}
          listButton={true}
          action={handleAction}
        />

        {showTable[index] && (
          <SiteStockInspectionItemList
            data={item}
            index={index}
            formik={formik}
            type={type}
            purpose={purpose}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={
          purpose == 'approve'
            ? `${label.APPROVE} ${label.OFFICE_EXPENSE}`
            : `${label.STOCK_INSPECTION} ${label.DETAIL}`
        }
      />
      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <ScrollView>
          {purpose == 'view' && (
            <ImageBackground
              source={Images.BANK_CARD}
              imageStyle={{ borderRadius: WINDOW_WIDTH * 0.03 }}
              style={styles.bankCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[styles.title, { color: 'white', fontSize: 20 }]}>
                  {'outlet : '}
                </Text>
                <Text style={[styles.title, { color: 'white', fontSize: 20 }]}>
                  {outletName || 'Account Holder name'}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.title,
                    { color: 'white', fontSize: 22, alignSelf: 'center' },
                  ]}>
                  {outletUniqueId}
                </Text>
              </View>
            </ImageBackground>
          )}

          <FlatList
            data={ListData?.data?.data}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 0 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
          {purpose == 'approve' && <InspectionFeedbackForm formik={formik} />}
          {(type == 'approved' || purpose == 'approve') && (
            <View style={{ alignSelf: 'center', marginVertical: 10 }}>
              <NeumorphicButton
                title={
                  purpose == 'approve' ? `${label.SUBMIT}` : `${label.PRINT}`
                }
                titleColor={Colors().purple}
                onPress={() => {
                  purpose == 'approve'
                    ? formik.handleSubmit()
                    : console.log('print button pressed');
                }}
                loading={loading}
              />
            </View>
          )}
        </ScrollView>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default SiteStockInspectionDetailScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});

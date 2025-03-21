import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getClientCompanyDetailById,
  getCompanyDetailById,
  getVendorCompanyDetailById,
} from '../../redux/slices/company/companyDetailSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';

const CompaniesDetailsScreen = ({ navigation, route }) => {
  const headerTitle = route?.params?.title;
  const company_id = route?.params?.company_id;
  const type = route?.params?.type;
  const label = ScreensLabel();
  const companytDetailDta = useSelector(state => state.companyDetail);
  const data = companytDetailDta?.data?.data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'my') {
      dispatch(getCompanyDetailById(company_id));
    } else if (type === 'sales') {
      dispatch(getClientCompanyDetailById(company_id));
    } else if (type === 'purchase') {
      dispatch(getVendorCompanyDetailById(company_id)); // Added dispatch here
    } else {
      // Handle other cases or add a fallback action if needed
    }
  }, [type, navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.COMPANY} ${label.DETAIL}`} />

      {companytDetailDta?.isLoading ? (
        <Loader />
      ) : !companytDetailDta?.isLoading &&
        !companytDetailDta?.isError &&
        companytDetailDta?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              <CustomeCard
                headerName={`${data?.company_name} COMPANY DETAILS :---`}
                data={[
                  { key: 'email', value: data?.company_email },
                  { key: 'Mobile', value: data?.company_mobile },
                  { key: 'Contact', value: data?.company_contact },
                  { key: 'PRimary Mob.', value: data?.primary_contact_number },
                  {
                    key: 'Contact PErson Name',
                    value: data?.company_contact_person,
                  },
                  {
                    key: 'Gst typ',
                    value: data?.gst_treatment_type,
                  },
                  { key: 'PAN No.', value: data?.pan_number },
                  {
                    key: 'Business legal name',
                    value: data?.business_legal_name,
                  },
                  {
                    key: 'state',
                    value: data?.state_name,
                  },
                  {
                    key: 'city',
                    value: data?.city_name,
                  },
                  {
                    key: 'address',
                    value: data?.company_address,
                  },
                  {
                    key: 'pincode',
                    value: data?.pin_code,
                  },
                ]}
                status={[
                  {
                    key: 'Enable Login',
                    value: data?.is_company_login_enable === '1' ? 'Yes' : 'No',
                    color: data?.is_company_login_enable
                      ? Colors().aprroved
                      : Colors().red,
                  },
                ]}
              />

              {data?.gst_details.map((item, index) => (
                <>
                  <CustomeCard
                    headerName={
                      index >= 0
                        ? `GST DETAILS :  ${index + 1}`
                        : 'GST DETAILS : '
                    }
                    data={[
                      {
                        key: 'Gst Number',
                        value: item?.gst_number.toUpperCase(),
                      },
                      {
                        key: 'Billing Address',
                        value: item?.billing_address.toUpperCase(),
                      },
                      {
                        key: 'Shipping Address',
                        value: item?.shipping_address.toUpperCase(),
                      },

                      {
                        component: (
                          <View style={{ alignItems: 'flex-end', flex: 1 }}>
                            {item?.is_default === '1' && (
                              <View style={styles.defaultView}>
                                <Text style={{ color: 'white' }}>DEFAULT</Text>
                              </View>
                            )}
                          </View>
                        ),
                      },
                    ]}
                  />
                </>
              ))}
            </View>
          </ScrollView>
        </>
      ) : companytDetailDta?.isError ? (
        <InternalServer />
      ) : (
        <Text>{companytDetailDta?.data?.message} </Text>
      )}
    </SafeAreaView>
  );
};

export default CompaniesDetailsScreen;

const styles = StyleSheet.create({
  titleTxt: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardtxt: {
    flexShrink: 1,
    marginRight: 10,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  defaultView: {
    backgroundColor: Colors().purple,
    borderRadius: 8,
    height: 25,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

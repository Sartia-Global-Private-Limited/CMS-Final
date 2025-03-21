import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {Icon} from '@rneui/base';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {addEnergySchema} from '../../../utils/FormSchema';
import {
  addUserEnergyCompany,
  assignUserEnergyCompany,
  EnergyCompanyDetails,
} from '../../../redux/slices/energyCompany/company/getAllUserEnergyCompanySlice';
import {getEnergyAreaDataById} from '../../../redux/slices/energy team/addUpdateEnergyTeamSlice';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import Loader from '../../../component/Loader';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';
import DataNotFound from '../../../component/DataNotFound';

const EnergyCompanyDetailsScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const ec_id = route?.params?.id;
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  useEffect(() => {
    getCompanyData();
  }, []);

  const getCompanyData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(EnergyCompanyDetails(ec_id)).unwrap();
      console.log('res', res);
      if (res.status) {
        setCompanyData(res.data);
        setLoading(false);
      } else {
        setCompanyData([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={'Energy Company Details'} />
      <ScrollView>
        {loading ? (
          <View style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}>
            <Loader />
          </View>
        ) : (
          <View>
            <View>
              <CustomeCard
                headerName={`${companyData?.company_name} COMPANY DETAILS :---`}
                data={[
                  {key: 'Company Name', value: companyData?.company_name},
                  {key: 'Email', value: companyData?.email},
                  {key: 'Contact No.', value: companyData?.contact_no},
                  {key: 'Alt number', value: companyData?.alt_number},
                  {key: 'Address', value: companyData?.address_1},
                  {key: 'City', value: companyData?.city},
                  {
                    key: 'ro name',
                    value: companyData?.regional_office_name,
                  },
                  {
                    key: 'sales area name',
                    value: companyData?.sales_area_name,
                  },
                  {
                    key: 'Status',
                    value: companyData?.status,
                  },
                  {
                    key: 'website url',
                    value: companyData?.website_url,
                  },
                  {
                    key: 'zone name',
                    value: companyData?.zone_name,
                  },
                  {
                    key: 'Pin Code',
                    value: companyData?.pin_code,
                  },
                ]}
              />
              <Text
                style={{
                  paddingHorizontal: 15,
                  color: Colors().purple,
                  fontSize: 20,
                }}>
                Users
              </Text>
              {companyData?.users && companyData?.users?.length > 0 ? (
                companyData?.users?.map(item => (
                  <View key={item.id}>
                    <CustomeCard
                      avatarImage={item?.image}
                      data={[
                        {key: 'Name', value: item?.name},
                        {key: 'Email', value: item?.email},
                        {key: 'Contact No.', value: item?.contact_no},
                        {key: 'User Type', value: item?.user_type},
                        {
                          key: 'Status',
                          value: item?.status == 1 ? 'Active' : 'In Active',
                          keyColor:
                            item?.status == 1
                              ? Colors().aprroved
                              : Colors().rejected,
                        },
                      ]}
                    />
                  </View>
                ))
              ) : (
                <View
                  style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.5}}>
                  <DataNotFound />
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnergyCompanyDetailsScreen;

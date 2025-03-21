/*    ----------------Created Date :: 25- July -2024   ----------------- */

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import ImageViewer from '../../component/ImageViewer';
import { getOutletDetailById } from '../../redux/slices/outlet management/getOutletDetailSlice';

const OutletDetailScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();
  /* declare props constant variale*/
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getOutletDetail);

  const data = listData?.data?.data;

  useEffect(() => {
    dispatch(getOutletDetailById(edit_id));
  }, [edit_id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getOutletDetailById(edit_id));

      setRefreshing(false);
    }, 2000);
  }, []);

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case 1:
        return Colors().pending;
      case 2:
        return Colors().aprroved;
      case 3:
        return Colors().rejected;

      default:
        break;
    }
  };

  /*function for getting status text */
  const getStatusText = status => {
    switch (status) {
      case 1:
        return 'requested';
      case 2:
        return 'approved';
      case 3:
        return 'rejected';

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.OUTLET} ${label.DETAIL}`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{}}>
              {/* card for  basic detail */}
              <CustomeCard
                headerName={'Basic DETAILS'}
                avatarImage={data?.outlet_image}
                data={[
                  {
                    key: 'Oultet id',
                    value: data?.outlet_unique_id ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'outlet name',
                    value: data?.outlet_name ?? '--',
                  },
                  {
                    key: 'Zone',
                    value: data?.zone_name ?? '--',
                  },
                  {
                    key: 'Regional office',
                    value: data?.regional_office_name ?? '--',
                  },
                  {
                    key: 'Sales Area',
                    value: data?.sales_area_name ?? '--',
                  },
                  {
                    key: 'District',
                    value: data?.district_name ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: getStatusText(data?.status),
                    color: getStatusColor(data?.status),
                  },
                ]}
              />

              {/* card for contact detail */}
              <CustomeCard
                headerName={'Contact DETAILS'}
                data={[
                  {
                    key: 'CONTACT PERSON NAME',
                    value: data?.outlet_contact_person_name ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'CONTACT NUMBER',
                    value: data?.outlet_contact_number ?? '--',
                  },
                  {
                    key: 'PRIMARY NUMBER ',
                    value: data?.primary_number ?? '--',
                  },
                  {
                    key: 'SECONDARY NUMBER',
                    value: data?.secondary_number ?? '--',
                  },
                  {
                    key: 'PRIMARY EMAIL',
                    value: data?.primary_email ?? '--',
                  },
                  {
                    key: 'SECONDARY EMAIL',
                    value: data?.secondary_email ?? '--',
                  },
                ]}
              />

              {/* card for Location detail */}
              <CustomeCard
                headerName={'Location DETAILS'}
                data={[
                  {
                    key: 'Location',
                    value: data?.location ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'Address',
                    value: data?.address ?? '--',
                  },
                  {
                    key: 'Latitude',
                    value: data?.outlet_lattitude ?? '--',
                  },
                  {
                    key: 'Longitude',
                    value: data?.outlet_longitude ?? '--',
                  },
                  {
                    key: 'RESV',
                    value: data?.outlet_resv ?? '--',
                  },
                ]}
              />

              {/* card for other detail */}
              <CustomeCard
                headerName={'Other DETAILS'}
                data={[
                  {
                    key: 'customer CODE ',
                    value: data?.customer_code ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'CATEGORY ',
                    value: data?.outlet_category ?? '--',
                  },
                  {
                    key: 'CCNOMS ',
                    value: data?.outlet_ccnoms ?? '--',
                  },
                  {
                    key: 'CCNOHSD ',
                    value: data?.outlet_ccnohsd ?? '--',
                  },
                ]}
              />
            </View>
            {/*view for modal of upate */}
            {imageModalVisible && (
              <ImageViewer
                visible={imageModalVisible}
                imageUri={imageUri}
                cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
                downloadBtnPress={true}
              />
            )}
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'No supplier found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.8,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateSuplierScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default OutletDetailScreen;

const styles = StyleSheet.create({});

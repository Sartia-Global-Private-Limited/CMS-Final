import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import ImageViewer from '../../../component/ImageViewer';
import {getOutletsDetailById} from '../../../redux/slices/energyCompany/outlets/getAllOutletListSlice';

const OutletDetailScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();
  /* declare props constant variale*/
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [outletDetails, setOutletDetails] = useState(false);
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getOutletsDetailById(edit_id)).unwrap();
      if (result.status) {
        setOutletDetails(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setOutletDetails([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setOutletDetails([]);
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case 1:
        return Colors().aprroved;
      case 2:
        return Colors().rejected;

      default:
        break;
    }
  };

  /*function for getting status text */
  const getStatusText = status => {
    switch (status) {
      case 1:
        return 'ACTIVE';
      case 2:
        return 'INACTIVE';

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.OUTLET} ${label.DETAIL}`} />
      <ScrollView>
        <View style={{}}>
          {/* card for  basic detail */}
          <CustomeCard
            headerName={'Basic DETAILS'}
            avatarImage={outletDetails?.outlet_image}
            data={[
              {
                key: 'Oultet id',
                value: outletDetails?.outlet_unique_id ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'outlet name',
                value: outletDetails?.outlet_name ?? '--',
              },
              {
                key: 'Zone',
                value: outletDetails?.zone_name ?? '--',
              },
              {
                key: 'Regional office',
                value: outletDetails?.regional_office_name ?? '--',
              },
              {
                key: 'Sales Area',
                value: outletDetails?.sales_area_name ?? '--',
              },
              {
                key: 'District',
                value: outletDetails?.district_name ?? '--',
              },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(outletDetails?.status),
                color: getStatusColor(outletDetails?.status),
              },
            ]}
          />

          {/* card for contact detail */}
          <CustomeCard
            headerName={'Contact DETAILS'}
            data={[
              {
                key: 'CONTACT PERSON NAME',
                value: outletDetails?.outlet_contact_person_name ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'CONTACT NUMBER',
                value: outletDetails?.outlet_contact_number ?? '--',
              },
              {
                key: 'PRIMARY NUMBER ',
                value: outletDetails?.primary_number ?? '--',
              },
              {
                key: 'SECONDARY NUMBER',
                value: outletDetails?.secondary_number ?? '--',
              },
              {
                key: 'PRIMARY EMAIL',
                value: outletDetails?.primary_email ?? '--',
              },
              {
                key: 'SECONDARY EMAIL',
                value: outletDetails?.secondary_email ?? '--',
              },
            ]}
          />

          {/* card for Location detail */}
          <CustomeCard
            headerName={'Location DETAILS'}
            data={[
              {
                key: 'Location',
                value: outletDetails?.location ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'Address',
                value: outletDetails?.address ?? '--',
              },
              {
                key: 'Latitude',
                value: outletDetails?.outlet_lattitude ?? '--',
              },
              {
                key: 'Longitude',
                value: outletDetails?.outlet_longitude ?? '--',
              },
              {
                key: 'RESV',
                value: outletDetails?.outlet_resv ?? '--',
              },
            ]}
          />

          {/* card for other detail */}
          <CustomeCard
            headerName={'Other DETAILS'}
            data={[
              {
                key: 'customer CODE ',
                value: outletDetails?.customer_code ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'CATEGORY ',
                value: outletDetails?.outlet_category ?? '--',
              },
              {
                key: 'CCNOMS ',
                value: outletDetails?.outlet_ccnoms ?? '--',
              },
              {
                key: 'CCNOHSD ',
                value: outletDetails?.outlet_ccnohsd ?? '--',
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
    </SafeAreaView>
  );
};

export default OutletDetailScreen;

const styles = StyleSheet.create({});

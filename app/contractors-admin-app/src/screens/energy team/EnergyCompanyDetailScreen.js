/*    ----------------Created Date :: 8 - August -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import DataNotFound from '../../component/DataNotFound';
import CustomeCard from '../../component/CustomeCard';
import { getEnergyTeamDetailById } from '../../redux/slices/energy team/getEnergyTeamDetailSlice';

const EnergyCompanyDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;
  const userId = route?.params?.userId;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getEnergyTeamDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getEnergyTeamDetailById({ id: id, userId: userId }));
  }, [id, userId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getEnergyTeamDetailById({ id: id, userId: userId }));

      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.ENERGY_TEAM} ${label.DETAIL}`} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{}}>
              {/* card for assest detail */}
              <CustomeCard
                headerName={'user detail'}
                data={[
                  {
                    key: 'user name',
                    value: all_Data?.username ?? '--',
                  },
                  {
                    key: 'mobile number',
                    value: all_Data?.mobile ?? '--',
                  },
                  {
                    key: 'alternative number',
                    value: all_Data?.alt_number ?? '--',
                  },
                  {
                    key: 'email',
                    value: all_Data?.email ?? '--',
                  },
                  {
                    key: 'city',
                    value: all_Data?.city ?? '--',
                  },
                  {
                    key: 'pincode',
                    value: all_Data?.pin_code ?? '--',
                  },
                  {
                    key: 'address',
                    value: all_Data?.address ?? '--',
                  },
                  {
                    key: 'country',
                    value: all_Data?.country ?? '--',
                  },
                  {
                    key: 'joining date',
                    value: all_Data?.joining_date ?? '--',
                  },
                  {
                    key: 'description',
                    value: all_Data?.description ?? '--',
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
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

export default EnergyCompanyDetailScreen;

const styles = StyleSheet.create({});

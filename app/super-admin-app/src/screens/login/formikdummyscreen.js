import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import {getCompanyDetailById} from '../../redux/slices/companyDetailSlice';

const CompaniesDetailsScreen = ({navigation, route}) => {
  const headerTitle = route?.params?.title;
  const company_id = route?.params?.company_id;
  const companytDetail = useSelector(state => state.companyDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyDetailById(company_id));
  }, [company_id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        leftIconPress={() => navigation.goBack()}
        headerTitle={headerTitle}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'home'}
        rightIcontype={IconType.AntDesign}
      />

      {companytDetail?.isLoading ? (
        <Loader />
      ) : !companytDetail?.isLoading &&
        !companytDetail?.isError &&
        companytDetail?.data?.status ? (
        <>
          <Text>make ui here</Text>
        </>
      ) : companytDetail?.isError ? (
        <InternalServer />
      ) : !companytDetail?.data?.status &&
        companytDetail?.data?.message === 'Data not found' ? (
        <>
          <Text>data not found block</Text>
        </>
      ) : (
        <Text>{companytDetail?.data?.message} </Text>
      )}
    </SafeAreaView>
  );
};

export default CompaniesDetailsScreen;

const styles = StyleSheet.create({});

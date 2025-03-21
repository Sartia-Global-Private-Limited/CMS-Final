import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import InternalServer from '../../../component/InternalServer';
import Loader from '../../../component/Loader';
import moment from 'moment';
import { getProductDetailById } from '../../../redux/slices/category&product/product/getProductDetailSlice';
import FloatingAddButton from '../../../component/FloatingAddButton';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';

const ProductDetailScreen = ({ navigation, route }) => {
  const prodcut_id = route?.params?.id;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getProductDetail);
  const data = listData?.data?.data;
  const label = ScreensLabel();

  useEffect(() => {
    dispatch(getProductDetailById(prodcut_id));
  }, [prodcut_id, isFocused]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().purple;
      case '2':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'In Stock';

      case '2':
        return 'Out of Stock';

      default:
        break;
    }
  }

  /* for getting color of publish*/
  function getPublishColor(action) {
    switch (action) {
      case '0':
        return Colors().red;
      case '1':
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /*for getting the text of publish*/
  function getPublishText(status) {
    switch (status) {
      case '0':
        return 'Not Published';

      case '1':
        return 'Published';

      default:
        break;
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.PRODUCT} ${label.DETAIL}`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              {/* card for stock request  detail */}
              <CustomeCard
                avatarImage={data?.image_url}
                data={[
                  {
                    key: 'Product name',
                    value: data?.product_name ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  { key: 'category', value: data?.category_name ?? '--' },

                  {
                    key: 'Price',
                    value: `	₹ ${data?.price}`,
                    keyColor: Colors().aprroved,
                  },

                  {
                    key: 'quantity',
                    value: `${data?.quantity}`,
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'alert quantity',
                    value: `${data?.quantity}`,
                    keyColor: Colors().red,
                  },
                  {
                    key: 'Created By',
                    value: `${data?.created_by_name}`,
                  },
                  {
                    key: 'Created At',
                    value: `${data?.created_at}`,
                    keyColor: Colors().pending,
                  },
                  {
                    key: 'AVAIL. STATUS',
                    value: getStatusText(data?.availability_status),
                    keyColor: getStatusColor(data?.availability_status),
                  },
                ]}
              />

              {/*card for bank details*/}
              <CustomeCard
                headerName={'bank detail'}
                data={[
                  {
                    key: 'supplier name',
                    value: data?.supplier_name ?? '-  - - ',
                  },
                  {
                    key: 'manufact. date',
                    value:
                      moment(data?.manufacturing_date).format('DD-MM-YYYY') ??
                      '-  - - ',
                  },
                  {
                    key: 'expiry date',
                    value:
                      moment(data?.expiry_date).format('DD-MM-YYYY') ??
                      '-  - - ',
                  },
                  {
                    key: 'is published ',
                    value: getPublishText(data?.is_published) ?? '-  - - ',
                    keyColor: getPublishColor(data?.is_published),
                  },
                ]}
                status={[
                  {
                    key: ' availability status',
                    value: getStatusText(data?.availability_status),
                    color: getStatusColor(data?.availability_status),
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message === 'Data not found' ? (
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
                navigation.navigate('AddUpdateWorkQuotationScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({});

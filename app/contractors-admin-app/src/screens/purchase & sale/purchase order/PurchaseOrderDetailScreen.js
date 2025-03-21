/*    ----------------Created Date :: 14- June -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import { Menu, MenuItem } from 'react-native-material-menu';
import { getPurchaseOrderDetailById } from '../../../redux/slices/purchase & sale/purchase-order/getPurchaseOrderDetailSlice';
import { apiBaseUrl } from '../../../../config';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import Dowloader from '../../../utils/Dowloader';
import ImageViewer from '../../../component/ImageViewer';
import { Icon } from '@rneui/themed';

const PurchaseOrderDetailScreen = ({ navigation, route }) => {
  const poId = route?.params?.poId;
  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ListData = useSelector(state => state.getPurchaseOrderDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(
      getPurchaseOrderDetailById({
        poId: poId,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [poId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(
        getPurchaseOrderDetailById({ poId: poId, pageNo: pageNo, pageSize }),
      );

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = ['Item list'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');
    setVisible(false);

    switch (valueToSend) {
      case 'Itemlist':
        navigation.navigate('PoDetaiItemListScreen', {
          poId: poId,
        });
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={`${label.PURCHASE} ${label.ORDER} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />

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
              <View style={{ alignSelf: 'flex-end' }}>
                <Menu
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                  style={{}}>
                  {menuData.map(itm => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, { color: Colors().pureBlack }] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>

              {/* card for complaint detail */}
              <CustomeCard
                headerName={'PO DETAILS'}
                data={[
                  {
                    key: 'po date',
                    value: all_Data?.po_date,
                  },
                  {
                    key: 'Po Regional office',
                    value: all_Data?.regional_office_name,
                  },
                  {
                    key: 'state',
                    value: all_Data?.state_name,
                  },
                  {
                    key: 'PO Number',
                    value: all_Data?.po_number,
                  },
                  {
                    key: 'Limit',
                    value: `₹ ${all_Data?.limit}`,
                    keyColor: Colors().red,
                  },
                  {
                    key: 'Remaining amount',
                    value: `₹ ${all_Data?.remaining_po_amount}`,
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Security deposit date',
                    value: all_Data?.security_deposit_date,
                  },
                  {
                    key: 'overall gst type',
                    value: all_Data?.gst_title || '----',
                  },
                  {
                    key: 'Gst %',
                    value: all_Data?.gst_percent || '----',
                  },
                ]}
              />

              {/* card for tender detail */}
              <CustomeCard
                headerName={'Tender DETAILS'}
                data={[
                  {
                    key: 'Tender date',
                    value: all_Data?.tender_date,
                  },
                  {
                    key: 'Tender Number',
                    value: all_Data?.tender_number,
                  },
                  {
                    key: 'Bank name',
                    value: all_Data?.bank_name,
                  },
                  {
                    key: 'Security deposit amount',
                    value: `₹ ${all_Data?.security_deposit_amount || 0}`,
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Cr date',
                    value: all_Data?.cr_date,
                  },
                  {
                    key: 'Cr Number',
                    value: all_Data?.cr_number,
                  },
                  {
                    key: 'Cr code',
                    value: all_Data?.cr_code,
                  },
                ]}
              />

              {/* card for external Field*/}
              <CustomeCard
                headerName={'External field'}
                data={[
                  {
                    key: 'Created at',
                    value: all_Data?.created_at,
                  },
                  {
                    key: 'created by',
                    value: all_Data?.created_by,
                  },
                  {
                    key: 'work',
                    value: all_Data?.work,
                  },
                  ...(all_Data?.cr_copy || all_Data?.sd_letter
                    ? [
                        {
                          component: (
                            <View style={styles.crView}>
                              {all_Data?.cr_copy && (
                                <View style={styles.titleView}>
                                  <Text
                                    style={[
                                      styles.cardtext,
                                      { color: Colors().pureBlack },
                                    ]}>
                                    cr copy :
                                  </Text>
                                  {['jpg', 'jpeg', 'png', 'jfif'].includes(
                                    GetFileExtension(all_Data?.cr_copy),
                                  ) && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setImageModalVisible(true);
                                        setImageUri(
                                          `${apiBaseUrl}${all_Data?.cr_copy}`,
                                        );
                                      }}>
                                      <Image
                                        source={{
                                          uri: `${apiBaseUrl}${all_Data?.cr_copy}`,
                                        }}
                                        style={styles.imageStyle}
                                      />
                                    </TouchableOpacity>
                                  )}
                                  {['pdf', 'doc', 'docx'].includes(
                                    GetFileExtension(all_Data?.cr_copy),
                                  ) && (
                                    <View style={{}}>
                                      <Icon
                                        name={
                                          GetFileExtension(all_Data?.cr_copy) ==
                                          'pdf'
                                            ? 'file-pdf-o'
                                            : 'document-text-outline'
                                        }
                                        type={
                                          GetFileExtension(all_Data?.cr_copy) ==
                                          'pdf'
                                            ? IconType.FontAwesome
                                            : IconType.Ionicons
                                        }
                                        size={
                                          GetFileExtension(all_Data?.cr_copy) ==
                                          'pdf'
                                            ? 50
                                            : 60
                                        }
                                        color={
                                          GetFileExtension(all_Data?.cr_copy) ==
                                          'pdf'
                                            ? Colors().red
                                            : Colors().skyBule
                                        }
                                        onPress={() =>
                                          Dowloader(
                                            `${apiBaseUrl}${all_Data?.cr_copy}`,
                                          )
                                        }
                                      />
                                    </View>
                                  )}
                                </View>
                              )}

                              {all_Data?.sd_letter && (
                                <View style={styles.titleView}>
                                  <Text
                                    style={[
                                      styles.cardtext,
                                      { color: Colors().pureBlack },
                                    ]}>
                                    sd letter :
                                  </Text>
                                  {['jpg', 'jpeg', 'png', 'jfif'].includes(
                                    GetFileExtension(all_Data?.sd_letter),
                                  ) && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setImageModalVisible(true);
                                        setImageUri(
                                          `${apiBaseUrl}${all_Data?.sd_letter}`,
                                        );
                                      }}>
                                      <Image
                                        source={{
                                          uri: `${apiBaseUrl}${all_Data?.sd_letter}`,
                                        }}
                                        style={styles.imageStyle}
                                      />
                                    </TouchableOpacity>
                                  )}
                                  {['pdf', 'doc', 'docx'].includes(
                                    GetFileExtension(all_Data?.sd_letter),
                                  ) && (
                                    <View style={{}}>
                                      <Icon
                                        name={
                                          GetFileExtension(
                                            all_Data?.sd_letter,
                                          ) == 'pdf'
                                            ? 'file-pdf-o'
                                            : 'document-text-outline'
                                        }
                                        type={
                                          GetFileExtension(
                                            all_Data?.sd_letter,
                                          ) == 'pdf'
                                            ? IconType.FontAwesome
                                            : IconType.Ionicons
                                        }
                                        size={
                                          GetFileExtension(
                                            all_Data?.sd_letter,
                                          ) == 'pdf'
                                            ? 50
                                            : 60
                                        }
                                        color={
                                          GetFileExtension(
                                            all_Data?.sd_letter,
                                          ) == 'pdf'
                                            ? Colors().red
                                            : Colors().skyBule
                                        }
                                        onPress={() =>
                                          Dowloader(
                                            `${apiBaseUrl}${all_Data?.sd_letter}`,
                                          )
                                        }
                                      />
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
              {imageModalVisible && (
                <ImageViewer
                  visible={imageModalVisible}
                  imageUri={imageUri}
                  cancelBtnPress={() =>
                    setImageModalVisible(!imageModalVisible)
                  }
                  downloadBtnPress={true}
                />
              )}
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

export default PurchaseOrderDetailScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  crView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  imageStyle: {
    height: 50,
    width: 80,
    borderRadius: 8,
  },
});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import {Icon} from '@rneui/base';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import {Image} from 'react-native';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import CustomeCard from '../../../component/CustomeCard';
import {getAttachementByComplaintId} from '../../../redux/slices/billing management/measurement/getAttachementDetailSlice';
import NeumorphCard from '../../../component/NeumorphCard';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import Dowloader from '../../../utils/Dowloader';
import ImageViewer from '../../../component/ImageViewer';

const ViewMeasurementDetailScreen = ({navigation, route}) => {
  const complaint_id = route?.params?.complaint_id;
  const label = ScreensLabel();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  const attachementDetailDta = useSelector(state => state.getAttachementDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAttachementByComplaintId(complaint_id));
  }, [complaint_id]);

  const {attachment_details, complaints_Details} =
    attachementDetailDta?.data?.data || {};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.MEASUREMENTS} ${label.DETAIL}`} />

      {attachementDetailDta?.isLoading ? (
        <Loader />
      ) : !attachementDetailDta?.isLoading &&
        !attachementDetailDta?.isError &&
        attachementDetailDta?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              {/* card for complaint detail */}
              <CustomeCard
                headerName={'COmplaint DETAILS'}
                data={[
                  {
                    key: 'compplaint id',
                    value: complaints_Details?.complaint_unique_id,
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'Company name',
                    value: complaints_Details?.companyDetails?.company_name,
                  },
                  {
                    key: 'complaint raise by',
                    value: complaints_Details?.complaintRaiserDetails?.name,
                  },
                  {
                    key: 'COMPLAINT TYPE',
                    value: complaints_Details?.complaint_type,
                  },
                  {
                    component: (
                      <View style={{marginLeft: '85%'}}>
                        <NeumorphCard
                          lightShadowColor={Colors().darkShadow2}
                          darkShadowColor={Colors().lightShadow}>
                          <Icon
                            name={'edit'}
                            type={IconType.Feather}
                            color={Colors().aprroved}
                            style={[styles.actionIcon]}
                            onPress={() =>
                              navigation.navigate(
                                'AddUpdateMeasurementAttachement',
                                {
                                  edit_id: complaint_id,
                                  update_id: attachment_details?.[0]?.id,
                                },
                              )
                            }
                          />
                        </NeumorphCard>
                      </View>
                    ),
                  },
                ]}
              />

              {attachment_details?.[0]?.filePath &&
                attachment_details?.[0]?.filePath.map(item => {
                  return (
                    <>
                      <CustomeCard
                        data={[
                          {
                            component: (
                              <>
                                {['jpg', 'jpeg', 'png'].includes(
                                  GetFileExtension(item?.file),
                                ) && (
                                  <NeumorphCard>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setImageModalVisible(true);
                                        setImageUri(
                                          item?.file
                                            ? `${apiBaseUrl}${item?.file}`
                                            : Image.resolveAssetSource(
                                                Images.DEFAULT_PROFILE,
                                              ).uri,
                                        );
                                      }}>
                                      <Image
                                        source={{
                                          uri: item?.file
                                            ? `${apiBaseUrl}${item?.file}`
                                            : Image.resolveAssetSource(
                                                Images.DEFAULT_PROFILE,
                                              ).uri,
                                        }}
                                        style={styles.ImageView}
                                      />
                                    </TouchableOpacity>
                                  </NeumorphCard>
                                )}
                                {['pdf', 'doc', 'docx'].includes(
                                  GetFileExtension(item?.file),
                                ) && (
                                  <View style={{marginHorizontal: 130}}>
                                    <NeumorphCard>
                                      <Icon
                                        name={
                                          GetFileExtension(item?.file) == 'pdf'
                                            ? 'file-pdf-o'
                                            : 'document-text-outline'
                                        }
                                        type={
                                          GetFileExtension(item?.file) == 'pdf'
                                            ? IconType.FontAwesome
                                            : IconType.Ionicons
                                        }
                                        size={60}
                                        color={
                                          GetFileExtension(item?.file) == 'pdf'
                                            ? Colors().red
                                            : Colors().skyBule
                                        }
                                        style={{
                                          padding: 10,
                                          marginTop: 2,
                                        }}
                                        onPress={() =>
                                          Dowloader(
                                            `${apiBaseUrl}${item?.file}`,
                                            complaints_Details?.complaint_unique_id,
                                          )
                                        }
                                      />
                                    </NeumorphCard>
                                  </View>
                                )}
                              </>
                            ),
                          },
                        ]}
                      />
                    </>
                  );
                })}
            </View>
            {imageModalVisible && (
              <ImageViewer
                visible={imageModalVisible}
                imageUri={imageUri}
                uniqueId={complaints_Details?.complaint_unique_id}
                cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
                downloadBtnPress={true}
              />
            )}
          </ScrollView>
        </>
      ) : attachementDetailDta?.isError ? (
        <InternalServer />
      ) : !attachementDetailDta?.data?.status &&
        attachementDetailDta?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default ViewMeasurementDetailScreen;

const styles = StyleSheet.create({
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  ImageView: {
    height: WINDOW_HEIGHT * 0.12,
    width: WINDOW_WIDTH * 0.88,
    borderRadius: 8,
    borderColor: Colors().black2,
  },
});

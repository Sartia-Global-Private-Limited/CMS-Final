import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Fileupploader from '../../../component/Fileupploader';
import NeumorphicButton from '../../../component/NeumorphicButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import {Icon} from '@rneui/themed';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphCard from '../../../component/NeumorphCard';
import {useFormik} from 'formik';

import ScreensLabel from '../../../constants/ScreensLabel';
import ImageViewer from '../../../component/ImageViewer';
import {useDispatch} from 'react-redux';
import {
  addMeasurementDoc,
  updateMeasurementDoc,
} from '../../../redux/slices/billing management/measurement/addUpdateMeasurementDocSlice';
import Toast from 'react-native-toast-message';
import {getAttachementByComplaintId} from '../../../redux/slices/billing management/measurement/getAttachementDetailSlice';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import {apiBaseUrl} from '../../../../config';
import AlertModal from '../../../component/AlertModal';

const AddUpdateMeasurementAttachement = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;
  const complaintId = route?.params?.complaintId;
  const update_id = route?.params?.update_id;

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState([]);
  const refRBSheet = useRef(RBSheet);
  const label = ScreensLabel();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSingleDetail();
  }, [edit_id]);

  /*fucntio for getting single detail of attachement*/
  const fetchSingleDetail = async () => {
    const result = await dispatch(
      getAttachementByComplaintId(edit_id),
    ).unwrap();
    if (result?.status) {
      setEditData(result?.data?.attachment_details?.[0]?.filePath);
    } else {
      setEditData([]);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      docs: edit_id ? editData : [],
    },
    // validationSchema: addDocumentSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const modiFiedFileData = values?.docs?.map(itm => {
      return {
        file:
          typeof itm?.file == 'string'
            ? itm?.file
            : `data:${itm?.file?.type};base64,${itm?.file?.base64}`,
        title: itm?.title,
        ...(edit_id ? {fileFormat: itm?.fileFormat} : {}),
      };
    });

    const sData = {
      ...(edit_id ? {id: update_id} : {complaint_id: complaintId}),
      docs: modiFiedFileData,
    };

    try {
      setLoading(true);
      const result = edit_id
        ? await dispatch(updateMeasurementDoc(sData)).unwrap()
        : await dispatch(addMeasurementDoc(sData)).unwrap();

      if (result?.status) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
        navigation.navigate('MeasurementTopTab');
      } else {
        Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({type: 'error', text1: error, position: 'bottom'});
    }
  };

  /*fucntion  for showing pdf */
  const showPdf = file => {
    if (typeof file == 'string') {
      if (['pdf'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'application/pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  /*fucntion  for showing image */
  const showImage = file => {
    if (typeof file == 'string') {
      if (['jpg', 'jpeg', 'png'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'image/jpeg' || file?.type == 'image/png') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  /*fucntion  for showing docx */
  const showDocs = file => {
    if (typeof file == 'string') {
      if (['doc', 'docx'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (
        file?.type == 'application/msword' ||
        file?.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={edit_id ? label.UPDATE_ATTACHEMENT : label.ADD_ATTACHEMENT}
      />
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {formik?.values.docs.map((itm, idx) => (
              <>
                <View key={idx} style={{flexDirection: 'row'}}>
                  {itm?.file && (
                    <View style={{marginRight: 10}}>
                      {/* Add margin for spacing between items */}
                      <View style={styles.crossIcon}>
                        <Icon
                          name="close"
                          color={Colors().lightShadow}
                          type={IconType.AntDesign}
                          size={15}
                          onPress={() =>
                            formik.setFieldValue(
                              `docs`,
                              formik.values.docs.filter((_, i) => i !== idx),
                            )
                          }
                        />
                      </View>

                      {showDocs(itm?.file) && (
                        <TouchableOpacity
                          style={{alignSelf: 'center'}}
                          onPress={() => {
                            setImageModalVisible(true);

                            setImageUri(
                              edit_id && typeof itm?.file == 'string'
                                ? `${apiBaseUrl}${itm?.file}`
                                : `${itm?.file?.uri}`,
                            );
                          }}>
                          <View
                            style={[
                              styles.Image,
                              {marginTop: 10, justifyContent: 'center'},
                            ]}>
                            <Icon
                              name="document-text-outline"
                              type={IconType.Ionicons}
                              size={50}
                              color={Colors().skyBule}
                            />
                          </View>
                        </TouchableOpacity>
                      )}

                      {showPdf(itm?.file) && (
                        <TouchableOpacity
                          style={{alignSelf: 'center'}}
                          onPress={() => {
                            setImageModalVisible(true);

                            setImageUri(
                              edit_id && typeof itm?.file == 'string'
                                ? `${apiBaseUrl}${itm?.file}`
                                : `${itm?.file?.uri}`,
                            );
                          }}>
                          <View
                            style={[
                              styles.Image,
                              {marginTop: 10, justifyContent: 'center'},
                            ]}>
                            <Icon
                              name="file-pdf-o"
                              type={IconType.FontAwesome}
                              size={45}
                              color={Colors().red}
                            />
                          </View>
                        </TouchableOpacity>
                      )}

                      {showImage(itm?.file) && (
                        <TouchableOpacity
                          style={{alignSelf: 'center'}}
                          onPress={() => {
                            setImageModalVisible(true);

                            setImageUri(
                              edit_id && typeof itm?.file == 'string'
                                ? `${apiBaseUrl}${itm?.file}`
                                : `${itm?.file?.uri}`,
                            );
                          }}>
                          <Image
                            source={{
                              uri:
                                edit_id && typeof itm?.file == 'string'
                                  ? `${apiBaseUrl}${itm?.file}`
                                  : `${itm?.file?.uri}`,
                            }}
                            style={[styles.Image, {marginTop: 10}]}
                          />
                        </TouchableOpacity>
                      )}
                      <TextInput
                        placeholder="TYPE TITLE"
                        numberOfLines={2}
                        rows={2}
                        multiline
                        defaultValue={itm?.title}
                        autoCapitalize="characters"
                        placeholderTextColor={Colors().pureBlack}
                        style={[
                          styles.title,
                          {
                            color: Colors().pureBlack,
                            alignSelf: 'center',
                            maxWidth: WINDOW_WIDTH * 0.2,
                            textAlign: 'center',
                            width: '100%',
                          },
                        ]}
                        onChangeText={formik.handleChange(`docs.${idx}.title`)}
                      />
                    </View>
                  )}
                </View>
              </>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 30,
            }}>
            <NeumorphCard
              lightShadowColor={Colors().darkShadow2}
              darkShadowColor={Colors().lightShadow}>
              <Icon
                name="plus"
                type={IconType.AntDesign}
                color={Colors().aprroved}
                style={styles.actionIcon}
                onPress={() => refRBSheet.current.open()}
              />
            </NeumorphCard>
            <Text
              style={[
                styles.title,
                {
                  alignSelf: 'center',
                  marginLeft: 10,
                  color: Colors().aprroved,
                },
              ]}>
              attachement
            </Text>
          </View>
          {formik.values.docs.length <= 0 && (
            <Text
              style={[
                styles.errorMesage,
                {alignSelf: 'center'},
              ]}>{`Bill is required`}</Text>
          )}

          <View style={{alignSelf: 'center', marginVertical: 50}}>
            <NeumorphicButton
              title={`${label.SUBMIT}`}
              titleColor={Colors().purple}
              onPress={() => {
                edit_id ? setVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>

          {visible && (
            <AlertModal
              visible={visible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setVisible(!visible)}
              ConfirmBtnPress={() => formik.handleSubmit()}
            />
          )}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            />
          )}

          <Fileupploader
            btnRef={refRBSheet}
            cameraOption={{base64: true, multiselet: false}}
            cameraResponse={item => {
              formik.setFieldValue(`docs`, [
                ...formik.values.docs,
                {file: item, title: ''},
              ]);
              refRBSheet.current.close();
            }}
            galleryOption={{base64: true, multiselet: true}}
            galleryResponse={items => {
              const updatedDocs = [...formik.values.docs];
              items.forEach(itm => {
                updatedDocs.push({file: itm, title: ''});
              });
              formik.setFieldValue('docs', updatedDocs);
              refRBSheet.current.close();
            }}
            documentOption={{
              base64: true,
              multiselet: true,
              fileType: ['pdf', 'doc', 'docx'],
            }}
            documentResponse={items => {
              const updatedDocs = [...formik.values.docs];
              items.forEach(itm => {
                updatedDocs.push({file: itm, title: ''});
              });
              formik.setFieldValue('docs', updatedDocs);
              refRBSheet.current.close();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateMeasurementAttachement;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
  },

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -2,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

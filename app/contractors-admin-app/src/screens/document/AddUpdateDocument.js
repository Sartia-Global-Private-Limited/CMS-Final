import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useFormik } from 'formik';
import { Icon } from '@rneui/themed';
import { addDocumentSchema } from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import { getDocCategory } from '../../redux/slices/document/getDocCategoryListSlice';
import { getAdminUsersbyRole, getAllRoles } from '../../redux/slices/commonApi';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import ImageViewer from '../../component/ImageViewer';
import { selectUser } from '../../redux/slices/authSlice';
import {
  addDocument,
  updateDocument,
} from '../../redux/slices/document/addUpdateDocumentSlice';
import { getDocumemtDetailById } from '../../redux/slices/document/getDocumentDetailSlice';
import { apiBaseUrl } from '../../../config';
import MultiSelectComponent from '../../component/MultiSelectComponent';
import Fileupploader from '../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import ScreensLabel from '../../constants/ScreensLabel';

const AddUpdateDocument = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const refRBSheet = useRef(RBSheet);
  const label = ScreensLabel();

  useEffect(() => {
    fetchAllDocCategoryList();
    fetchAllRolesList();
    if (edit_id) {
      fetchSingleData();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      category_id: edit?.document_category_id || '',
      user_type: edit?.user_type || '',
      // user_id: edit?.user_id ? JSON.parse(edit?.user_id) : [],
      user_id: edit?.user_id
        ? JSON.parse(edit?.user_id.replace(/\\/g, '').replace(/"/g, ''))
        : [],

      images: edit?.image ? JSON.parse(edit?.image) : [],
      remark: edit?.remark || '',
    },
    validationSchema: addDocumentSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formdata = new FormData();
    formdata.append('category_id', values.category_id);
    formdata.append('user_type', values.user_type);
    formdata.append('user_id', JSON.stringify(values.user_id));
    formdata.append('remarks', values.remark);
    formdata.append('createdBy', user.id);

    const storePathArray = [];
    const nameArray = [];

    values.images.forEach(obj => {
      if ('storePath' in obj) {
        // storePathArray.push(JSON.stringify(obj));
        storePathArray.push(obj);
      }
      if ('name' in obj) {
        nameArray.push(obj);
      }
    });

    if (storePathArray.length > 0) {
      formdata.append('images', JSON.stringify(storePathArray));
    }

    if (nameArray.length > 0) {
      for (let i = 0; i < nameArray.length; i++) {
        formdata.append('images', nameArray[i]);
      }
    }

    if (edit_id) {
      formdata.append('updated_by', user.id);
      formdata.append('id', edit_id);
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateDocument(formdata)).unwrap()
        : await dispatch(addDocument(formdata)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('DocumentListScreen');
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSingleData = async () => {
    const res = await dispatch(getDocumemtDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
      fetchAlluserList(res?.data?.user_type);
    } else {
      setEdit({});
    }
  };

  /* fetch Document category list  */
  const fetchAllDocCategoryList = async () => {
    const res = await dispatch(getDocCategory({ search: '' })).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.title,
        };
      });
      setAllCategory(rData);
    } else {
      setAllCategory([]);
    }
  };
  /* fetch all role list  */
  const fetchAllRolesList = async () => {
    const res = await dispatch(getAllRoles()).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.id,
          label: item?.name,
        };
      });
      setAllRoles(rData);
    } else {
      setAllRoles([]);
    }
  };

  /* fetch all user  list  */
  const fetchAlluserList = async id => {
    const res = await dispatch(getAdminUsersbyRole(id)).unwrap();

    if (res?.status === true) {
      const rData = res?.data.map(item => {
        return {
          value: item?.user_id,
          label: item?.user_name,
        };
      });
      setAllUser(rData);
    } else {
      Toast.show({
        type: 'error',
        text1: res?.message,
        position: 'bottom',
      });
      setAllUser([]);
    }
  };

  {
    /*function for removing image with index*/
  }
  const removeDocument = indexOfRemove => {
    let arr = [];
    arr = formik.values.images.filter((item, index) => indexOfRemove !== index);
    formik.setFieldValue(`images`, arr);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.DOCUMENT} ${label.UPDATE}`
            : `${label.DOCUMENT} ${label.ADD}`
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'document category'}
            required={true}
            data={allCategory}
            value={formik.values.category_id}
            onChange={val => {
              formik.setFieldValue(`category_id`, val.value);
            }}
            errorMessage={formik?.errors?.category_id}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'user type'}
            required={true}
            data={allRoles}
            value={formik.values.user_type}
            onChange={val => {
              fetchAlluserList(val.value);
              formik.setFieldValue(`user_type`, val.value);
            }}
            errorMessage={formik?.errors?.user_type}
          />

          <MultiSelectComponent
            title={'user name'}
            required={true}
            data={allUser}
            value={formik.values.user_id}
            inside={true}
            onChange={item => {
              formik.setFieldValue(`user_id`, item);
            }}
            errorMessage={formik?.errors?.user_id}
          />

          <NeumorphicTextInput
            title={'remark'}
            required={true}
            value={formik.values.remark}
            onChangeText={formik.handleChange(`remark`)}
            errorMessage={formik?.errors?.remark}
          />

          {formik.values.images && (
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.userNameView, { columnGap: 10 }]}>
                {formik.values.images.map((itm, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setImageModalVisible(true);
                      setImageUri(
                        edit_id
                          ? `${apiBaseUrl}${itm?.storePath}`
                          : `${itm?.uri}`,
                      );
                    }}>
                    <Image
                      source={{
                        uri:
                          edit_id && !itm.uri
                            ? `${apiBaseUrl}${itm?.storePath}`
                            : `${itm?.uri}`,
                      }}
                      style={[styles.Image, { marginTop: 10 }]}
                    />

                    <View style={styles.crossIcon}>
                      <Icon
                        name="close"
                        type={IconType.AntDesign}
                        size={15}
                        color={'white'}
                        onPress={() => removeDocument(index)}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.btnView}>
          <NeumorphicButton
            // disabled={type === 'view'}
            title={'Document'}
            titleColor={Colors().pending}
            btnHeight={WINDOW_HEIGHT * 0.05}
            // onPress={() => selectPhotoTapped('document')}
            onPress={() => refRBSheet.current.open()}
            btnRadius={2}
            iconName={'upload'}
            iconType={IconType.Feather}
            iconColor={Colors().black2}
          />
        </View>

        <View style={{ alignSelf: 'center', marginVertical: 10 }}>
          <NeumorphicButton
            title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
            titleColor={Colors().purple}
            onPress={() => {
              edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
            }}
            loading={loading}
          />
        </View>

        {/*view for modal of upate */}
        {imageModalVisible && (
          <ImageViewer
            visible={imageModalVisible}
            imageUri={imageUri}
            cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            // downloadBtnPress={item => downloadImageRemote(item)}
          />
        )}
        <Fileupploader
          btnRef={refRBSheet}
          cameraOption={{
            base64: false,
            multiselet: true,
          }}
          cameraResponse={item => {
            if (!item) return; // Check if item has a value
            // const imageFormData = {
            //   uri: item?.uri,
            //   name: item?.name,
            //   type: item?.type,
            // };
            const updatedDoc = [
              ...formik?.values?.images,
              {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              },
            ];

            formik.setFieldValue(`images`, updatedDoc);
            refRBSheet.current.close();
          }}
          galleryOption={{ base64: false, multiselet: true }}
          galleryResponse={item => {
            if (!item) return; // Check if item has a value
            const updatedDoc = [...formik?.values?.images];
            item.forEach(itm => {
              updatedDoc.push({
                uri: itm?.uri,
                name: itm?.name,
                type: itm?.type,
              });
            });

            formik.setFieldValue(`images`, updatedDoc);

            refRBSheet.current.close();
          }}
        />

        {updateModalVisible && (
          <AlertModal
            visible={updateModalVisible}
            iconName={'clock-edit-outline'}
            icontype={IconType.MaterialCommunityIcons}
            iconColor={Colors().aprroved}
            textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
            cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
            ConfirmBtnPress={() => formik.handleSubmit()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateDocument;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },

  btnView: {
    alignSelf: 'center',
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
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
});

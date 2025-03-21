import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import SeparatorComponent from '../../../component/SeparatorComponent';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import { addEmployeeSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphCard from '../../../component/NeumorphCard';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import * as ImagePicker from 'react-native-image-picker';
import ImageViewer from '../../../component/ImageViewer';
import { Image } from 'react-native';
import { apiBaseUrl } from '../../../../config';
import { Icon, ListItem } from '@rneui/base';
import { getTeamList } from '../../../redux/slices/hr-management/teams/getTeamListSlice';
import { useDispatch } from 'react-redux';
import {
  getAllEmployeeListByRoleId,
  getAllRoles,
} from '../../../redux/slices/commonApi';
import {
  addEmployee,
  updateEmployee,
} from '../../../redux/slices/hr-management/employees/addUpdateEmployeeSlice';
import { getEmployeeDetail } from '../../../redux/slices/hr-management/employees/getEmployeeDetailSlice';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import { store } from '../../../redux/store';

const AddUpdateEmployeesScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const { isDarkMode } = store.getState().getDarkMode;
  const [edit, setEdit] = useState({});
  const [allTeam, setAllTeam] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  // const skillData = [];
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);

  const [openIndex, setOpenIndex] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllRoles();
    requestCameraPermission();
    requestExternalWritePermission();

    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      name: edit?.name || '',
      email: edit?.email || '',
      password: edit?.password || '',
      user_name: edit?.use_name || '',
      mobile: edit?.mobile || '',
      joining_date: edit?.joining_date || '',
      role_id: edit.role_id
        ? { label: edit?.role_name, value: edit?.role_id }
        : '',
      address: edit?.address || '',
      graduation: edit?.graduation || null,
      post_graduation: edit?.post_graduation || null,
      doctorate: edit?.doctorate || null,
      image: edit?.image || null,
      skills: edit?.skills ? edit.skills : '',
      team_id: edit?.team_id || '',
      employment_status: edit?.employment_status
        ? { label: edit?.employment_status, value: edit?.employment_status }
        : '',
      salary: edit?.salary || '',
      salary_term: edit?.salary_term
        ? { label: edit?.salary_term, value: edit?.salary_term }
        : '',
      pan: edit?.pan || '',
      upload_pan_card: edit?.pan_card_image || '',
      epf_no: edit?.epf_no || '',
      aadhar: edit?.aadhar || '',
      aadhar_card_front_image: edit?.aadhar_card_front_image || '',
      aadhar_card_back_image: edit?.aadhar_card_back_image || '',
      esi_no: edit?.esi_no || '',
      bank_name: edit?.bank_name || '',
      ifsc_code: edit?.ifsc_code || '',
      account_number: edit?.account_number || '',
      upload_bank_documents: edit?.bank_documents || '',
      family_info: edit?.family_info || [
        {
          member_name: '',
          member_relation: '',
        },
      ],
      credit_limit: edit?.credit_limit || '',
    },
    validationSchema: addEmployeeSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('mobile', values.mobile);
    formData.append(
      'joining_date',
      moment(formik.values.joining_date).format('YYYY-MM-DD'),
    );
    formData.append('status', 1);
    formData.append('role_id', values.role_id.value);
    formData.append('address', values.address);
    formData.append('skills', values?.skills?.value);
    formData.append('employment_status', values.employment_status.label);
    formData.append('pan', values.pan);
    formData.append('aadhar', values.aadhar);
    formData.append('epf_no', values.epf_no);
    formData.append('esi_no', values.esi_no);
    formData.append('bank_name', values.bank_name);
    formData.append('ifsc_code', values.ifsc_code);
    formData.append('account_number', values.account_number);
    formData.append('department', '');
    formData.append('family_info', JSON?.stringify(values.family_info));
    formData.append('team_id', values.team_id.value);
    formData.append('salary', values.salary);
    formData.append('salary_term', values.salary_term.value);
    formData.append('image', values.image);
    formData.append('graduation', values.graduation);
    formData.append('post_graduation', values.post_graduation);
    formData.append('doctorate', values.doctorate);
    formData.append('upload_pan_card', values.upload_pan_card);
    formData.append(
      'upload_aadhar_card_image1',
      values.aadhar_card_front_image,
    );
    formData.append('upload_aadhar_card_image2', values.aadhar_card_back_image);
    formData.append('upload_bank_documents', values.upload_bank_documents);
    formData.append('credit_limit', values.credit_limit);
    if (edit.id) {
      formData.append('employee_id', edit.id);
    }

    try {
      if (edit_id) {
        setUpdateModalVisible(true);
        setConfrim(formData);
      } else {
        setLoading(true);
        const createEmpResult = await dispatch(addEmployee(formData)).unwrap();

        if (createEmpResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: createEmpResult?.message,
            position: 'bottom',
          });

          navigation.navigate('EmployeesListScreen');
        } else {
          Toast.show({
            type: 'error',
            text1: createEmpResult?.message,
            position: 'bottom',
          });

          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else return true;
  };

  requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  const selectPhotoTapped = async docType => {
    return Alert.alert('UPLOAD BILL IMAGE', '', [
      {
        text: 'cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'upload From Library',
        onPress: () => PhotoTapped('library', docType),
      },
      {
        text: 'capture Photo',
        onPress: () => {
          PhotoTapped('camera', docType);
        },
      },
    ]);
  };

  const PhotoTapped = async (type, docType) => {
    if (type == 'camera') {
      if (true) {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true,
          },
          includeBase64: true,
        };

        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let source = {
              type: 'application/png',
              uri: response.assets[0].uri,
            };
            sendImageFunc(response, 'img', docType);
          }
        });
      }
    } else if (type == 'library') {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
        includeBase64: true,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          if (response.assets[0].fileSize < 800000) {
            sendImageFunc(response, 'img', docType);
          } else {
            Alert.alert(
              'Maximum size ',
              'Only 800 KB file size is allowed ',
              [],
            );
          }
        }
      });
    } else if (type == 'pdf') {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: '',
          type: [types.pdf],
          copyTo: 'cachesDirectory',
        });

        if (response[0].size < 800000) {
          this.sendImageFunc(response, 'pdf');
        } else {
          Alert.alert('Maximum size ', 'Only 800 KB file size is allowed ', []);
        }
      } catch (err) {}
    }
  };
  const sendImageFunc = async (imageresponse, type, docType) => {
    const imageData = imageresponse.assets[0].uri;
    const imageFormData = {
      uri: imageresponse.assets[0].uri,
      name: imageresponse.assets[0].fileName,
      type: imageresponse.assets[0].type,
    };
    switch (docType) {
      case 'userimage':
        formik.setFieldValue(`image`, imageFormData);
        break;
      case 'graduation':
        formik.setFieldValue(`graduation`, imageFormData);
        break;
      case 'post-graduation':
        formik.setFieldValue(`post_graduation`, imageFormData);
        break;
      case 'doctorate':
        formik.setFieldValue(`doctorate`, imageFormData);
        break;
      case 'aadhar_front':
        formik.setFieldValue(`aadhar_card_front_image`, imageFormData);
        break;
      case 'aadhar_back':
        formik.setFieldValue(`aadhar_card_back_image`, imageFormData);
        break;
      case 'pan_card':
        formik.setFieldValue(`upload_pan_card`, imageFormData);
        break;
      case 'bank':
        formik.setFieldValue(`upload_bank_documents`, imageFormData);
        break;

      default:
        break;
    }
  };

  /*function for fetching team data*/
  const fetchTeamData = async () => {
    try {
      const result = await dispatch(getTeamList({ search: '' })).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.team_name,
          value: itm?.team_id,
        }));

        setAllTeam(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllTeam([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setAllTeam([]);
    }
  };

  const fetchAllUser = async roleId => {
    const result = await dispatch(getAllEmployeeListByRoleId(roleId)).unwrap();

    if (result.status) {
      const rData = result?.data?.map(itm => ({
        label: `${itm?.name} (${itm?.employee_id})`,
        value: itm?.id,
        image: itm?.image,
      }));

      setAllTeam(rData);
    } else {
      Toast.show({
        type: 'error',
        text1: result?.message,
        position: 'bottom',
      });

      setAllTeam([]);
    }
  };

  /*function for fetching all roles data*/
  const fetchAllRoles = async () => {
    try {
      const result = await dispatch(getAllRoles()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllRoles(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllRoles([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setAllRoles([]);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(
        getEmployeeDetail({ empId: edit_id }),
      ).unwrap();

      if (result.status) {
        setEdit(result?.data);
        if (result?.data?.role_id == '40') {
          fetchAllUser(9);
        } else if (result?.data?.role_id == 7) {
          fetchAllUser(40);
        } else {
          formik.setFieldValue('role_id', val);
          fetchTeamData();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setEdit([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setEdit([]);
    }
  };

  const updateEmpfunction = async reqBody => {
    setLoading(true);

    const updateTeamResult = await dispatch(updateEmployee(reqBody)).unwrap();

    if (updateTeamResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      Toast.show({
        type: 'success',
        text1: updateTeamResult?.message,
        position: 'bottom',
      });

      navigation.navigate('EmployeesListScreen');
    } else {
      Toast.show({
        type: 'error',
        text1: updateTeamResult?.message,
        position: 'bottom',
      });

      setLoading(false);
      setUpdateModalVisible(false);
    }
  };
  const accordionData = [
    { title: 'Basic details', content: 'Content for Item 1' },
    { title: 'Educational document', content: 'Content for Item 2' },
    { title: 'Salary and team details', content: 'Content for Item 3' },
    { title: 'Personal Documents', content: 'Content for Item 3' },
    { title: 'Bank detail', content: 'Content for Item 3' },
    { title: 'LOGIN CREDENTIALS', content: 'Content for Item 3' },
    { title: 'FAMILY (OPTIONAL)', content: 'Content for Item 3' },
  ];
  const employementOptions = [
    { value: 'Permanent', label: 'Permanent' },
    { value: 'Part-Time', label: 'Part-Time' },
  ];
  const salaryTermOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
  const relationOtions = [
    {
      label: 'Mother',
      value: 'Mother',
    },
    {
      label: 'Father',
      value: 'Father',
    },
    {
      label: 'Brother',
      value: 'Brother',
    },
    {
      label: 'Sister',
      value: 'Sister',
    },
    {
      label: 'husband',
      value: 'husband',
    },
    {
      label: 'Wife',
      value: 'Wife',
    },
    {
      label: 'Son',
      value: 'Son',
    },
    {
      label: 'Daughter',
      value: 'Daughter',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];

  const skillArray = [
    { value: 'Skilled', label: 'Skilled' },
    {
      value: 'Non Skilled',
      label: 'Non Skilled',
    },
  ];
  const handlePress = index => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const getFormError = (errors, index) => {
    let indexArray = [];

    if (errors.name || errors.mobile || errors.joining_date) {
      indexArray.push(0);
    }
    if (
      errors.salary ||
      errors.role_id ||
      errors.salary_term ||
      errors.employment_status
    ) {
      indexArray.push(2);
    }

    return indexArray;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={edit_id ? 'update employee' : 'Add employee'}
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          {accordionData.map((item, index) => (
            <ListItem.Accordion
              containerStyle={{
                backgroundColor: isDarkMode
                  ? Colors().cardBackground
                  : Colors().inputDarkShadow,
                borderRadius: 8,
              }}
              theme={{ colors: { background: Colors().red } }}
              icon={
                <Icon
                  name="down"
                  type={IconType.AntDesign}
                  size={20}
                  color={Colors().pureBlack}></Icon>
              }
              content={
                <>
                  <ListItem.Content style={{}}>
                    <ListItem.Title
                      style={[styles.title, { color: Colors().purple }]}>
                      {item?.title}
                      <>
                        {getFormError(formik.errors, index).includes(index) && (
                          <Icon
                            name="error-outline"
                            type={IconType.MaterialIcons}
                            color={Colors().red}></Icon>
                        )}
                      </>
                    </ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={index === openIndex}
              onPress={() => {
                handlePress(index);
              }}>
              {/*view for basic detail*/}
              {index == 0 && (
                <ListItem.Content>
                  <View style={{ rowGap: 2 }}>
                    <NeumorphicTextInput
                      title={'user name'}
                      required={true}
                      value={formik.values.name}
                      onChangeText={formik.handleChange('name')}
                      errorMessage={formik?.errors?.name}
                    />

                    <NeumorphicTextInput
                      title={'email'}
                      value={formik.values.email}
                      onChangeText={formik.handleChange('email')}
                    />

                    <NeumorphicTextInput
                      title={'address'}
                      value={formik.values.address}
                      onChangeText={formik.handleChange('address')}
                    />
                    {formik.values.image && (
                      <TouchableOpacity
                        onPress={() => {
                          setImageModalVisible(true),
                            setImageUri(
                              edit_id && !formik.values.image.uri
                                ? `${apiBaseUrl}${formik.values.image}`
                                : formik.values.image.uri,
                            );
                        }}>
                        <Image
                          source={{
                            uri:
                              edit_id && !formik.values.image.uri
                                ? `${apiBaseUrl}${formik.values.image}`
                                : formik.values.image.uri,
                          }}
                          style={styles.Image}
                        />
                      </TouchableOpacity>
                    )}

                    <View style={styles.btnView}>
                      <NeumorphicButton
                        title={' user image'}
                        titleColor={Colors().pending}
                        btnHeight={WINDOW_HEIGHT * 0.05}
                        onPress={() => selectPhotoTapped('userimage')}
                        btnRadius={2}
                        iconName={'upload'}
                        iconType={IconType.Feather}
                        iconColor={Colors().black2}
                        loading={loading}
                      />
                    </View>

                    <View style={styles.twoItemView}>
                      <View style={styles.leftView}>
                        <NeumorphicTextInput
                          width={WINDOW_WIDTH * 0.42}
                          title={'mobile'}
                          required={true}
                          value={formik.values.mobile}
                          maxLength={10}
                          keyboardType="number-pad"
                          onChangeText={txt => {
                            formik.setFieldValue(`mobile`, txt);
                          }}
                          errorMessage={formik?.errors?.mobile}
                        />
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphicTextInput
                          width={WINDOW_WIDTH * 0.45}
                          title={'joining date'}
                          required={true}
                          RightIconName={'calendar'}
                          RightIconType={IconType.AntDesign}
                          RightIconPress={() => setOpen(true)}
                          value={
                            formik.values.joining_date &&
                            moment(formik.values.joining_date).format(
                              'DD/MM//YYYY',
                            )
                          }
                          editable={false}
                          errorMessage={formik?.errors?.joining_date}
                        />
                      </View>
                    </View>
                    <DatePicker
                      modal
                      open={open}
                      date={new Date()}
                      mode="date"
                      onConfirm={date => {
                        setOpen(false);
                        // setDate(date);
                        formik.setFieldValue(`joining_date`, date);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </View>
                </ListItem.Content>
              )}

              {/*view for educational documents*/}
              {index == 1 && (
                <ListItem.Content>
                  {formik.values.graduation && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.graduation.uri
                              ? `${apiBaseUrl}${formik.values.graduation}`
                              : formik.values.graduation.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.graduation.uri
                              ? `${apiBaseUrl}${formik.values.graduation}`
                              : formik.values.graduation.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.btnView}>
                    <NeumorphicButton
                      title={' graduation'}
                      titleColor={Colors().pending}
                      btnHeight={WINDOW_HEIGHT * 0.05}
                      onPress={() => selectPhotoTapped('graduation')}
                      btnRadius={2}
                      iconName={'upload'}
                      iconType={IconType.Feather}
                      iconColor={Colors().black2}
                      loading={loading}
                    />
                  </View>

                  {formik.values.post_graduation && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.post_graduation.uri
                              ? `${apiBaseUrl}${formik.values.post_graduation}`
                              : formik.values.post_graduation.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.post_graduation.uri
                              ? `${apiBaseUrl}${formik.values.post_graduation}`
                              : formik.values.post_graduation.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.btnView}>
                    <NeumorphicButton
                      title={'post graduation'}
                      titleColor={Colors().pending}
                      btnHeight={WINDOW_HEIGHT * 0.05}
                      btnWidth={WINDOW_WIDTH * 0.5}
                      onPress={() => selectPhotoTapped('post-graduation')}
                      btnRadius={2}
                      iconName={'upload'}
                      iconType={IconType.Feather}
                      iconColor={Colors().black2}
                      loading={loading}
                    />
                  </View>

                  {formik.values.doctorate && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.doctorate.uri
                              ? `${apiBaseUrl}${formik.values.doctorate}`
                              : formik.values.doctorate.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.doctorate.uri
                              ? `${apiBaseUrl}${formik.values.doctorate}`
                              : formik.values.doctorate.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.btnView}>
                    <NeumorphicButton
                      title={' doctorate'}
                      titleColor={Colors().pending}
                      btnHeight={WINDOW_HEIGHT * 0.05}
                      onPress={() => selectPhotoTapped('doctorate')}
                      btnRadius={2}
                      iconName={'upload'}
                      iconType={IconType.Feather}
                      iconColor={Colors().black2}
                      loading={loading}
                    />
                  </View>
                </ListItem.Content>
              )}

              {/*view for salary and team details*/}
              {index == 2 && (
                <ListItem.Content>
                  <View style={{ rowGap: 2 }}>
                    <View style={styles.twoItemView}>
                      <View style={styles.leftView}>
                        <NeumorphicDropDownList
                          width={WINDOW_WIDTH * 0.42}
                          title={'skills'}
                          data={skillArray}
                          value={formik.values.skills}
                          onChange={val => {
                            formik.setFieldValue(`skills`, val);
                          }}
                        />
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphicDropDownList
                          width={WINDOW_WIDTH * 0.45}
                          title={'role'}
                          required={true}
                          data={allRoles}
                          value={formik.values.role_id}
                          onChange={val => {
                            formik.setFieldValue(`role_id`, val);
                            if (val?.value == 40) {
                              formik.setFieldValue('role_id', val);
                              fetchAllUser(9);
                            } else if (val?.value == 7) {
                              formik.setFieldValue('role_id', val);
                              fetchAllUser(40);
                            } else {
                              formik.setFieldValue('role_id', val);
                              fetchTeamData();
                            }
                          }}
                          errorMessage={formik?.errors?.role_id}
                        />
                      </View>
                    </View>

                    <NeumorphicDropDownList
                      width={WINDOW_WIDTH * 0.9}
                      title={
                        formik?.values?.role_id?.value === 7
                          ? 'supervisor'
                          : formik?.values?.role_id?.value === 40
                            ? 'area manager'
                            : 'team'
                      }
                      data={allTeam}
                      value={formik.values.team_id}
                      onChange={val => {
                        formik.setFieldValue(`team_id`, val);
                      }}
                    />

                    <View style={styles.twoItemView}>
                      <View style={styles.leftView}>
                        <NeumorphicDropDownList
                          width={WINDOW_WIDTH * 0.42}
                          title={'emp. status'}
                          required={true}
                          data={employementOptions}
                          value={formik.values.employment_status}
                          onChange={val => {
                            formik.setFieldValue(`employment_status`, val);
                          }}
                          errorMessage={formik?.errors?.employment_status}
                        />
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphicTextInput
                          width={WINDOW_WIDTH * 0.45}
                          title={'fund & stock limit'}
                          value={formik.values.credit_limit}
                          keyboardType="numeric"
                          onChangeText={val => {
                            formik.setFieldValue(`credit_limit`, val);
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.twoItemView}>
                      <View style={styles.leftView}>
                        <NeumorphicTextInput
                          width={WINDOW_WIDTH * 0.42}
                          title={'salary'}
                          required={true}
                          value={formik.values.salary.toString()}
                          keyboardType="number-pad"
                          onChangeText={formik.handleChange('salary')}
                          errorMessage={formik?.errors?.salary}
                        />
                      </View>
                      <View style={styles.rightView}>
                        <NeumorphicDropDownList
                          width={WINDOW_WIDTH * 0.45}
                          title={'salary term'}
                          required={true}
                          data={salaryTermOptions}
                          value={formik.values.salary_term}
                          onChange={val => {
                            formik.setFieldValue(`salary_term`, val);
                          }}
                          errorMessage={formik?.errors?.salary_term}
                        />
                      </View>
                    </View>
                  </View>
                </ListItem.Content>
              )}

              {/*view for personal documents details*/}
              {index == 3 && (
                <ListItem.Content style={{ rowGap: 8 }}>
                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        title={'pan no'}
                        value={formik.values.pan}
                        // keyboardType="number-pad"
                        maxLength={10}
                        onChangeText={formik.handleChange('pan')}
                      />
                    </View>
                    <View style={styles.rightView}>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        required={true}
                        title={'aadhar no'}
                        value={formik.values.aadhar}
                        keyboardType="number-pad"
                        maxLength={12}
                        onChangeText={formik.handleChange('aadhar')}
                        errorMessage={formik?.errors?.aadhar}
                      />
                    </View>
                  </View>

                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        title={'Epf no'}
                        value={formik.values.epf_no}
                        onChangeText={formik.handleChange('epf_no')}
                      />
                    </View>
                    <View style={styles.rightView}>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        title={'esi no'}
                        value={formik.values.esi_no}
                        onChangeText={formik.handleChange('esi_no')}
                      />
                    </View>
                  </View>

                  {formik.values.upload_pan_card && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.upload_pan_card.uri
                              ? `${apiBaseUrl}${formik.values.upload_pan_card}`
                              : formik.values.upload_pan_card.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.upload_pan_card.uri
                              ? `${apiBaseUrl}${formik.values.upload_pan_card}`
                              : formik.values.upload_pan_card.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}
                  {(formik.values.pan || formik.values.upload_pan_card) && (
                    <View style={styles.btnView}>
                      <NeumorphicButton
                        title={'Pan card'}
                        titleColor={Colors().pending}
                        btnHeight={WINDOW_HEIGHT * 0.05}
                        onPress={() => selectPhotoTapped('pan_card')}
                        btnRadius={2}
                        iconName={'upload'}
                        iconType={IconType.Feather}
                        iconColor={Colors().black2}
                        loading={loading}
                      />
                    </View>
                  )}
                  {formik.values.aadhar_card_front_image && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id &&
                              !formik.values.aadhar_card_front_image.uri
                              ? `${apiBaseUrl}${formik.values.aadhar_card_front_image}`
                              : formik.values.aadhar_card_front_image.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id &&
                            !formik.values.aadhar_card_front_image.uri
                              ? `${apiBaseUrl}${formik.values.aadhar_card_front_image}`
                              : formik.values.aadhar_card_front_image.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}
                  {(formik.values.aadhar ||
                    formik.values.aadhar_card_front_image) && (
                    <View style={styles.btnView}>
                      <NeumorphicButton
                        title={'Aadhar front'}
                        titleColor={Colors().pending}
                        btnHeight={WINDOW_HEIGHT * 0.05}
                        onPress={() => selectPhotoTapped('aadhar_front')}
                        btnRadius={2}
                        iconName={'upload'}
                        iconType={IconType.Feather}
                        iconColor={Colors().black2}
                        loading={loading}
                      />
                    </View>
                  )}
                  {formik.values.aadhar_card_back_image && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.aadhar_card_back_image.uri
                              ? `${apiBaseUrl}${formik.values.aadhar_card_back_image}`
                              : formik.values.aadhar_card_back_image.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.aadhar_card_back_image.uri
                              ? `${apiBaseUrl}${formik.values.aadhar_card_back_image}`
                              : formik.values.aadhar_card_back_image.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}
                  {(formik.values.aadhar ||
                    formik.values.aadhar_card_back_image) && (
                    <View style={styles.btnView}>
                      <NeumorphicButton
                        title={'Aadhar back'}
                        titleColor={Colors().pending}
                        btnHeight={WINDOW_HEIGHT * 0.05}
                        onPress={() => selectPhotoTapped('aadhar_back')}
                        btnRadius={2}
                        iconName={'upload'}
                        iconType={IconType.Feather}
                        iconColor={Colors().black2}
                        loading={loading}
                      />
                    </View>
                  )}
                </ListItem.Content>
              )}

              {/*view for bank details*/}
              {index == 4 && (
                <ListItem.Content style={{ rowGap: 8 }}>
                  <NeumorphicTextInput
                    title={'bank name'}
                    value={formik.values.bank_name}
                    onChangeText={formik.handleChange('bank_name')}
                  />
                  <View style={styles.twoItemView}>
                    <View style={styles.leftView}>
                      <NeumorphicTextInput
                        width={WINDOW_WIDTH * 0.42}
                        title={'Account number'}
                        value={formik.values.account_number}
                        keyboardType="number-pad"
                        // maxLength={10}
                        onChangeText={formik.handleChange('account_number')}
                      />
                    </View>
                    <View style={styles.rightView}>
                      <NeumorphicTextInput
                        title={'IFsc code'}
                        width={WINDOW_WIDTH * 0.42}
                        value={formik.values.ifsc_code}
                        onChangeText={formik.handleChange('ifsc_code')}
                      />
                    </View>
                  </View>
                  {formik.values.upload_bank_documents && (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true),
                          setImageUri(
                            edit_id && !formik.values.upload_bank_documents.uri
                              ? `${apiBaseUrl}${formik.values.upload_bank_documents}`
                              : formik.values.upload_bank_documents.uri,
                          );
                      }}>
                      <Image
                        source={{
                          uri:
                            edit_id && !formik.values.upload_bank_documents.uri
                              ? `${apiBaseUrl}${formik.values.upload_bank_documents}`
                              : formik.values.upload_bank_documents.uri,
                        }}
                        style={styles.Image}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.btnView}>
                    <NeumorphicButton
                      title={'bank document'}
                      titleColor={Colors().pending}
                      btnHeight={WINDOW_HEIGHT * 0.05}
                      onPress={() => selectPhotoTapped('bank')}
                      btnRadius={2}
                      iconName={'upload'}
                      iconType={IconType.Feather}
                      iconColor={Colors().black2}
                      loading={loading}
                    />
                  </View>
                </ListItem.Content>
              )}

              {/*view for Login credentials details*/}
              {index == 5 && (
                <ListItem.Content style={{ rowGap: 8 }}>
                  <NeumorphicTextInput
                    title={'user name'}
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                  />

                  <NeumorphicTextInput
                    title={'password'}
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                  />
                </ListItem.Content>
              )}

              {/*view for Family details*/}
              {index == 6 && (
                <>
                  {formik.values.family_info.map((item1, index1) => (
                    <View key={index1}>
                      <ListItem.Content style={{ rowGap: 8 }}>
                        <View style={styles.separatorHeading}>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.25}
                          />
                          <Text
                            style={[
                              styles.title,
                              { color: Colors().aprroved },
                            ]}>
                            {index1 >= 0
                              ? `Family member ${index1 + 1}`
                              : `Family member`}
                          </Text>
                          <SeparatorComponent
                            separatorColor={Colors().aprroved}
                            separatorHeight={1}
                            separatorWidth={WINDOW_WIDTH * 0.25}
                          />
                          <View style={styles.actionView2}>
                            {index1 <= 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  name="plus"
                                  type={IconType.AntDesign}
                                  color={Colors().aprroved}
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(`family_info`, [
                                      ...formik.values.family_info,
                                      {
                                        member_name: '',
                                        member_relation: '',
                                      },
                                    ])
                                  }
                                />
                              </NeumorphCard>
                            )}

                            {index1 > 0 && (
                              <NeumorphCard
                                lightShadowColor={Colors().darkShadow2}
                                darkShadowColor={Colors().lightShadow}>
                                <Icon
                                  style={styles.actionIcon}
                                  onPress={() =>
                                    formik.setFieldValue(
                                      `family_info`,
                                      formik.values.family_info.filter(
                                        (_, i) => i !== index1,
                                      ),
                                    )
                                  }
                                  name="minus"
                                  type={IconType.AntDesign}
                                  color={Colors().red}
                                />
                              </NeumorphCard>
                            )}
                          </View>
                        </View>

                        <View style={styles.twoItemView}>
                          <View style={styles.leftView}>
                            <NeumorphicTextInput
                              width={WINDOW_WIDTH * 0.42}
                              title={'name'}
                              value={
                                formik.values.family_info[index1].member_name
                              }
                              onChangeText={formik.handleChange(
                                `family_info.${index1}.member_name`,
                              )}
                            />
                          </View>
                          <View style={styles.rightView}>
                            <NeumorphicDropDownList
                              width={WINDOW_WIDTH * 0.42}
                              title={'relation'}
                              data={relationOtions}
                              value={
                                formik.values.family_info[index1]
                                  .member_relation
                              }
                              onChange={val => {
                                formik.setFieldValue(
                                  `family_info.${index1}.member_relation`,
                                  val.value,
                                );
                              }}
                            />
                          </View>
                        </View>
                      </ListItem.Content>
                    </View>
                  ))}
                </>
              )}
              <ListItem.Chevron />
            </ListItem.Accordion>
          ))}
          {/*view for modal of ImageViewer */}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
            />
          )}
          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => updateEmpfunction(confirm)}
            />
          )}
          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={edit_id ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateEmployeesScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },
  input: {
    color: Colors().text2,
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    margin: 8,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    flex: 1,
  },
  inputView2: {
    flexDirection: 'row',
  },
  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
    // justifyContent: 'flex-end',
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
    // marginBottom: WINDOW_HEIGHT * 0.01,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  dropdown: {
    // height: 50,
    // backgroundColor: 'yellow',
    marginLeft: 10,
    // flex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
    // backgroundColor: 'yellow',
  },
  createSkillView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
  },
});

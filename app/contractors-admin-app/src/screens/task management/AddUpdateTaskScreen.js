import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import Colors from '../../constants/Colors';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import { addTaskSchema } from '../../utils/FormSchema';
import NeumorphicButton from '../../component/NeumorphicButton';
import { useDispatch } from 'react-redux';
import AlertModal from '../../component/AlertModal';
import Toast from 'react-native-toast-message';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import moment from 'moment';
import { getAllTaskCategory } from '../../redux/slices/task-mangement/getTaskCategoryListSlice';
import { getAllEmplist, getAllUsers } from '../../redux/slices/commonApi';
import {
  addTask,
  updateTask,
} from '../../redux/slices/task-mangement/addUpdateTaskSlice';
import { getTaskDetailById } from '../../redux/slices/task-mangement/getTaskDetailSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import MultiSelectComponent from '../../component/MultiSelectComponent';

const AddUpdateTaskScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();

  const [edit, setEdit] = useState({});
  const [allCategory, setAllCategory] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [allEmployee, setAllEmloyee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const dispatch = useDispatch();

  const STATUS_ARRAY = [
    { value: 'assign', label: 'assign' },
    { value: 'in progress', label: 'in progress' },
    { value: 'completed', label: 'completed' },
  ];

  useEffect(() => {
    fetchAllCategory();
    fetchAllUser();
    fetchAllEmployee();

    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      title: edit?.title || '',
      project_name: edit?.project_name || '',
      collaborators: edit?.collaborators || '',
      assign_to: edit.assign_to || '',
      category_id: edit.category_id || '',
      start_date: edit.start_date
        ? moment(edit.start_date).format('YYYY-MM-DD')
        : '',
      end_date: edit.end_date ? moment(edit.end_date).format('YYYY-MM-DD') : '',
      status: edit.status || '',
    },
    validationSchema: addTaskSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      title: values.title,
      project_name: values.project_name,
      collaborators: values.collaborators,
      assign_to: values.assign_to,
      start_date: moment(values.start_date).format('YYYY-MM-DD'),
      end_date: moment(values.end_date).format('YYYY-MM-DD'),
      status: values.status,
      category_id: values.category_id,
    };
    if (edit.id) {
      sData['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateTask(sData)).unwrap()
        : await dispatch(addTask(sData)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('AllTaskListScreen');
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

  /*function for fetching category data*/
  const fetchAllCategory = async () => {
    try {
      const result = await dispatch(
        getAllTaskCategory({ search: '' }),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));

        setAllCategory(rData);
      } else {
        setAllCategory([]);
      }
    } catch (error) {
      setAllCategory([]);
    }
  };
  /*function for fetching user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));

        setAllUser(rData);
      } else {
        setAllUser([]);
      }
    } catch (error) {
      setAllUser([]);
    }
  };

  /*function for fetching Employee data*/
  const fetchAllEmployee = async () => {
    try {
      const result = await dispatch(getAllEmplist()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));

        setAllEmloyee(rData);
      } else {
        setAllEmloyee([]);
      }
    } catch (error) {
      setAllEmloyee([]);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getTaskDetailById(edit_id)).unwrap();

      if (result.status) {
        setEdit(result?.data);
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.TASK} ${label.UPDATE}`
            : `${label.TASK} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          {/*view for basic detail*/}

          <View style={{ rowGap: 2 }}>
            <NeumorphicDropDownList
              required={true}
              title={'Category name'}
              data={allCategory}
              value={formik.values.category_id}
              onChange={val => {
                formik.setFieldValue(`category_id`, val.value);
              }}
              errorMessage={formik.errors.category_id}
            />

            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.92}
              title={'title'}
              required={true}
              value={formik.values.title}
              onChangeText={formik.handleChange('title')}
              errorMessage={formik.errors.title}
            />

            <MultiSelectComponent
              title={'collaborators'}
              required={true}
              data={allUser}
              value={formik.values.collaborators}
              inside={true}
              onChange={item => {
                formik.setFieldValue(`collaborators`, item);
              }}
              errorMessage={formik?.errors?.collaborators}
            />

            <NeumorphicDropDownList
              title={'assign to'}
              required={true}
              data={allEmployee}
              value={formik.values.assign_to}
              onChange={val => {
                formik.setFieldValue(`assign_to`, val.value);
              }}
              errorMessage={formik.errors.assign_to}
            />

            <NeumorphicTextInput
              width={WINDOW_WIDTH * 0.92}
              required={true}
              title={'project name'}
              value={formik.values.project_name}
              onChangeText={formik.handleChange('project_name')}
              errorMessage={formik.errors.project_name}
            />

            <View style={styles.twoItemView}>
              <View style={styles.leftView}>
                <NeumorphDatePicker
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.42}
                  title={'start date'}
                  required={true}
                  iconPress={() => setOpenFromDate(!openFromDate)}
                  valueOfDate={
                    formik.values.start_date
                      ? moment(formik.values.start_date).format('DD/MM/YYYY')
                      : formik.values.start_date
                  }
                  modal
                  open={openFromDate}
                  date={new Date()}
                  mode="datetime"
                  onConfirm={date => {
                    formik.setFieldValue(`start_date`, date);

                    setOpenFromDate(false);
                  }}
                  onCancel={() => {
                    setOpenFromDate(false);
                  }}
                  errorMessage={formik.errors.start_date}></NeumorphDatePicker>
              </View>
              <View style={styles.rightView}>
                <NeumorphDatePicker
                  height={WINDOW_HEIGHT * 0.06}
                  width={WINDOW_WIDTH * 0.42}
                  title={'end date'}
                  required={true}
                  iconPress={() => setOpenToDate(!openToDate)}
                  valueOfDate={
                    formik.values.end_date
                      ? moment(formik.values.end_date).format('DD/MM/YYYY')
                      : formik.values.end_date
                  }
                  modal
                  open={openToDate}
                  date={new Date()}
                  mode="datetime"
                  onConfirm={date => {
                    formik.setFieldValue(`end_date`, date);

                    setOpenToDate(false);
                  }}
                  onCancel={() => {
                    setOpenToDate(false);
                  }}
                  errorMessage={formik.errors.end_date}></NeumorphDatePicker>
              </View>
            </View>

            <NeumorphicDropDownList
              title={'status'}
              required={true}
              data={STATUS_ARRAY}
              value={formik.values.status}
              onChange={val => {
                formik.setFieldValue(`status`, val.value);
              }}
              errorMessage={formik.errors.status}
            />
          </View>

          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => {
                formik.handleSubmit(), setUpdateModalVisible(false);
              }}
            />
          )}

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateTaskScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    margin: WINDOW_WIDTH * 0.05,
  },

  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
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
});

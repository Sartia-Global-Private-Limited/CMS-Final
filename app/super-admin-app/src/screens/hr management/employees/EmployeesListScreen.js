import {View, SafeAreaView, TouchableOpacity, Switch} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import {
  deleteEmpById,
  updateEmpStatus,
} from '../../../redux/slices/hr-management/employees/addUpdateEmployeeSlice';
import {getEmployeeList} from '../../../redux/slices/hr-management/employees/getEmployeeListSlice';
import AlertModal from '../../../component/AlertModal';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import {useFormik} from 'formik';
import {addRemarkSchema} from '../../../utils/FormSchema';
import {selectUser} from '../../../redux/slices/authSlice';
import CustomeCard from '../../../component/CustomeCard';
import Toast from 'react-native-toast-message';
import List from '../../../component/List/List';

const EmployeesListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const empListData = useSelector(state => state.getEmployeeList);
  const {user} = useSelector(selectUser);

  /*declare useState variable here */
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [emloyeeId, setEmployeeId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getEmployeeList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteEmp = async empId => {
    try {
      const deleteResult = await dispatch(deleteEmpById({empId})).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setEmployeeId('');
        dispatch(getEmployeeList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setEmployeeId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setEmployeeId('');
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      remark: '',
      updated_by: '',
      status: '',
    },
    validationSchema: addRemarkSchema,
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      id: values.id,
      remark: values.remark,
      updated_by: user.id,
      status: values.status,
    };
    try {
      const updateStausResult = await dispatch(
        updateEmpStatus({reqBody}),
      ).unwrap();
      if (updateStausResult?.status) {
        Toast.show({
          type: 'success',
          text1: updateStausResult?.message,
          position: 'bottom',
        });

        navigation.navigate('EmployeesListScreen');
        setStatusModalVisible(false);
        dispatch(getEmployeeList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: updateStausResult?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      console.error('Error in updateStausResult:', error);
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateEmployeesScreen', {
          edit_id: actionButton?.itemData?.id,
          // type: 'update',
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setEmployeeId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EmployeeDetailScreen', {
              empId: item?.id,
            })
          }>
          <CustomeCard
            allData={item}
            avatarImage={item?.image}
            data={[
              {
                key: 'employee id',
                value: item?.employee_id,
                keyColor: Colors().skyBule,
              },
              {key: 'employee name', value: item?.name},
              {key: 'email', value: item?.email},
              {key: 'mobile', value: item?.mobile},
              {key: 'joined', value: item?.joining_date},
              {
                key: 'Role name',
                value: item?.role_name,
                keyColor: Colors().skyBule,
              },
            ]}
            status={[
              {
                key: 'status',
                component: (
                  <NeumorphCard>
                    <View style={{padding: 5}}>
                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={item?.status ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                          setStatusModalVisible(true);
                          formik.setFieldValue(`id`, item?.id);
                          formik.setFieldValue(
                            `status`,
                            item?.status === 1 ? 0 : 1,
                          );
                        }}
                        value={item?.status === 1 ? true : false}
                      />
                    </View>
                  </NeumorphCard>
                ),
              },
            ]}
            editButton={true}
            deleteButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getEmployeeList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.EMPLOYEES} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />
      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          data={empListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateEmployeesScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteEmp(emloyeeId)}
        />
      )}
      {statusModalVisible && (
        <>
          <AlertModal
            visible={statusModalVisible}
            iconName={'circle-edit-outline'}
            icontype={IconType.MaterialCommunityIcons}
            iconColor={Colors().edit}
            textToShow={'ARE YOU SURE YOU WANT update the status!!'}
            cancelBtnPress={() => {
              setStatusModalVisible(!statusModalVisible);
              formik.setFieldValue(`remark`, '');
            }}
            remarkText={formik?.values?.remark}
            onRemarkChange={formik.handleChange('remark')}
            errorMesage={formik?.errors?.remark}
            ConfirmBtnPress={() => formik.handleSubmit()}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default EmployeesListScreen;

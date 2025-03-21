import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import CustomeHeader from '../../../component/CustomeHeader';
import {getAllTaxList} from '../../../redux/slices/master-data-management/tax/getTaxListSlice';
import {deleteTaxById} from '../../../redux/slices/master-data-management/tax/addUpdateTaxSlice';
import Toast from 'react-native-toast-message';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const TaxListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getTaxList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taxId, setTaxId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getAllTaxList({pageSize: pageSize, pageNo: pageNo}));
  }, [isFocused]);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllTaxList({search: searchvalue}));
  };

  const onSearchCancel = () => {
    dispatch(getAllTaxList({pageSize: pageSize, pageNo: pageNo}));
  };
  /* delete Stock request  function with id */
  const deleteTaxDetails = async () => {
    try {
      const deleteResult = await dispatch(deleteTaxById(taxId)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTaxId('');
        dispatch(getAllTaxList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTaxId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setTaxId('');
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().aprroved;
      case '0':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'Active';

      case '0':
        return 'In active';

      default:
        break;
    }
  }

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateTaxScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setTaxId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* List render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'Name',
              value: item?.name ?? '--',
            },
            {
              key: 'Billing name :',
              value: item?.billing_name ?? '--',
            },
            {
              key: 'value',
              value: `${item?.value}%`,
              keyColor: Colors().purple,
            },
          ]}
          status={[
            {
              key: 'Finacial year',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          editButton
          deleteButton
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`Taxes`} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateTaxScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getAllTaxList({pageSize: pageSize, pageNo: pageNo}));
          }}
        />
      </View>
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteTaxDetails()}
        />
      )}
    </SafeAreaView>
  );
};

export default TaxListScreen;

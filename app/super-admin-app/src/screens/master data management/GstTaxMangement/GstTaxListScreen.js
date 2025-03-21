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
import Toast from 'react-native-toast-message';
import {getAllGstTaxList} from '../../../redux/slices/master-data-management/gst-tax/getGstTaxListSlice';
import {deleteGstTaxById} from '../../../redux/slices/master-data-management/gst-tax/addUpdteGstTaxSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const GstTaxListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getGstTaxList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taxId, setTaxId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getAllGstTaxList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteGstTax = async () => {
    try {
      const deleteResult = await dispatch(deleteGstTaxById(taxId)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTaxId('');
        dispatch(getAllGstTaxList({pageSize: pageSize, pageNo: pageNo}));
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

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateGstTaxScreen', {
          edit_id: item?.id,
        });

        break;
      case 'delete':
        setTaxId(actionButton?.itemData?.id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.logo}
          allData={item}
          data={[
            {
              key: 'Gst title',
              value: item?.title ?? '--',
              keyColor: Colors().purple,
            },
            {
              key: 'Gst percentage',
              value: `${item?.percentage}%` ?? '--',
              keyColor: Colors().purple,
            },
          ]}
          status={[
            {
              key: 'Created At',
              value: item?.created_at,
              color: Colors().pending,
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`All gst Taxes`} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateGstTaxScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getAllGstTaxList({pageSize: pageSize, pageNo: pageNo}));
          }}
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
          ConfirmBtnPress={() => deleteGstTax()}
        />
      )}
    </SafeAreaView>
  );
};

export default GstTaxListScreen;

import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {getAllFinacialYearList} from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import NeumorphicButton from '../../../component/NeumorphicButton';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';
import {deleteEmployeeNoFomartById} from '../../../redux/slices/master-data-management/bill-format/addUpdateEmployeeNoFormatSlice';
import {getAllItemNoFormatList} from '../../../redux/slices/master-data-management/bill-format/getItemNoFormatListSlice';

const ItemNumberFormatListScreen = ({navigation, route}) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getItemNoFormatList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [allFY, setAllFY] = useState([]);
  const [formatId, setFomatId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAllFinaceYear();
    dispatch(
      getAllItemNoFormatList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteBillFormat = async () => {
    try {
      const deleteResult = await dispatch(
        deleteEmployeeNoFomartById(formatId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setFomatId('');
        dispatch(getAllItemNoFormatList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setFomatId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setFomatId('');
    }
  };

  /* function for fetching all finance year*/
  const fetchAllFinaceYear = async () => {
    const res = await dispatch(getAllFinacialYearList({search: ''})).unwrap();
    if (res?.status) {
      const rData = res?.data.map(item => {
        return {
          label: item?.year_name,
          value: item?.id,
        };
      });
      setAllFY(rData);
    } else {
      setAllFY([]);
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateItemNumberFormat', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setFomatId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        allData={item}
        data={[
          {
            key: 'PRefix',
            value: item?.prefix ?? '--',
            keyColor: Colors().pureBlack,
          },
          {
            key: 'Year format',
            value: item?.financial_year_format ?? '--',
            keyColor: Colors().pureBlack,
          },
          {
            key: 'start number',
            value: item?.start_item_number ?? '--',
            keyColor: Colors().pureBlack,
          },
          {
            key: 'sample format',
            value: item?.sample_format ?? '--',
            keyColor: Colors().skyBule,
          },
        ]}
        status={[
          {
            key: 'financial year',
            value: item?.financial_year,
            color: Colors().pending,
          },
        ]}
        editButton={true}
        deleteButton={false}
        action={handleAction}
      />
    );
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View style={styles.listView}>
        {item?.label && (
          <Text numberOfLines={1} style={[styles.inputText, {marginLeft: 10}]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    dispatch(getAllItemNoFormatList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`Item Number Format`} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          gap: 5,
          backgroundColor: Colors().screenBackground,
        }}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.055}
          width={WINDOW_WIDTH * 0.76}
          RightIconName="caretdown"
          RightIconType={IconType.AntDesign}
          RightIconColor={Colors().darkShadow2}
          placeholder={'Finance year'}
          data={allFY}
          labelField={'label'}
          valueField={'label'}
          value={searchText}
          renderItem={renderDropDown}
          search={false}
          placeholderStyle={styles.inputText}
          selectedTextStyle={styles.selectedTextStyle}
          style={styles.inputText}
          onChange={val => {
            setSearchText(val.label);
          }}
          onCancle={() => {
            setSearchText('');
          }}
        />
        <View style={{alignSelf: 'center'}}>
          <NeumorphicButton
            title={'reset'}
            fontSize={WINDOW_HEIGHT * 0.015}
            btnHeight={WINDOW_HEIGHT * 0.05}
            btnWidth={WINDOW_WIDTH * 0.16}
            btnBgColor={Colors().purple}
            titleColor={Colors().lightShadow}
            btnRadius={8}
            onPress={() => resetFunction()}
          />
        </View>
      </View>

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={''}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllItemNoFormatList({
                pageSize: pageSize,
                pageNo: pageNo,
              }),
            );
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
          ConfirmBtnPress={() => deleteBillFormat()}
        />
      )}
    </SafeAreaView>
  );
};

export default ItemNumberFormatListScreen;

const styles = StyleSheet.create({
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

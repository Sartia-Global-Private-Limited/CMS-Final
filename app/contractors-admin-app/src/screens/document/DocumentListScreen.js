/*    ----------------Created Date :: 6- sep -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../component/AlertModal';
import { getDocList } from '../../redux/slices/document/getDocumentListSlice';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../component/DropDownList';
import moment from 'moment';
import { Badge } from '@rneui/themed';
import ImageViewer from '../../component/ImageViewer';
import { Image } from 'react-native';
import { apiBaseUrl } from '../../../config';
import { deleteDocumentById } from '../../redux/slices/document/addUpdateDocumentSlice';
import { getDocCategory } from '../../redux/slices/document/getDocCategoryListSlice';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';

const DocumentListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const label = ScreensLabel();
  const listData = useSelector(state => state.getDocumentList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allCategory, setAllCategory] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  useEffect(() => {
    dispatch(
      getDocList({ search: searchText, pageSize: pageSize, pageNo: pageNo }),
    );
    fetchAllDocCategoryList();
  }, [isFocused, searchText]);

  /* delete Document category delete with id */
  const deleteDocument = async () => {
    try {
      const deleteResult = await dispatch(
        deleteDocumentById(documentId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setDocumentId('');

        dispatch(getDocList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setDocumentId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /* fetch Document category list  */
  const fetchAllDocCategoryList = async () => {
    try {
      const res = await dispatch(getDocCategory({ search: '' })).unwrap();

      if (res?.status === true) {
        const rData = res?.data.map(item => {
          return {
            value: item?.title,
            label: item?.title,
          };
        });
        setAllCategory(rData);
      } else {
        setAllCategory([]);
      }
    } catch (error) {
      setAllCategory([]);
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateDocument', {
          edit_id: actionButton?.itemData?.document_id,
        });

        break;

      case 'delete':
        setDeleteModalVisible(true),
          setDocumentId(actionButton?.itemData?.document_id);

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <CustomeCard
          allData={item}
          data={[
            { key: 'title', value: item?.title },
            { key: 'remark', value: item?.remark },
            {
              key: 'user name',
              component: (
                <View style={styles.userNameView}>
                  {item?.users?.map((itm, index) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 5,
                      }}>
                      <Badge value={index + 1} status="primary" />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, { marginLeft: 5 }]}>
                        {itm?.user_name}
                      </Text>
                    </View>
                  ))}
                </View>
              ),
            },
            {
              key: 'attachement',
              component: (
                <View style={[styles.userNameView, { columnGap: 10 }]}>
                  {JSON.parse(item?.image).map((itm, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setImageModalVisible(true);
                        setImageUri(`${apiBaseUrl}${itm?.storePath}`);
                      }}>
                      <Image
                        source={{
                          uri: `${apiBaseUrl}${itm?.storePath}`,
                        }}
                        style={[styles.Image, { marginTop: 10 }]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ),
            },
          ]}
          status={[
            {
              key: 'date',
              value: `${moment(item?.created_at).format('DD/MM/YYYY hh:mm A')}`,
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.DOCUMENT_LIST}`} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
        }}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.055}
          width={WINDOW_WIDTH * 0.75}
          data={allCategory}
          value={searchText}
          onCancle={() => {
            setSearchText('');
          }}
          placeHolderTxt={'Category'}
          onChange={val => {
            setSearchText(val.label);
          }}
        />
        <View style={{ alignSelf: 'center' }}>
          <NeumorphicButton
            title={'reset'}
            fontSize={WINDOW_HEIGHT * 0.015}
            btnHeight={WINDOW_HEIGHT * 0.05}
            btnWidth={WINDOW_WIDTH * 0.16}
            btnBgColor={Colors().purple}
            titleColor={Colors().lightShadow}
            btnRadius={8}
            onPress={() => setSearchText('')}
          />
        </View>
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          addAction={'AddUpdateDocument'}
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getDocCategory({ pageSize: pageSize, pageNo: pageNo }));
          }}
        />
      </View>

      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
          downloadBtnPress={true}
        />
      )}

      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteDocument()}
        />
      )}
    </SafeAreaView>
  );
};

export default DocumentListScreen;

const styles = StyleSheet.create({
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.05,
    width: WINDOW_WIDTH * 0.18,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
});

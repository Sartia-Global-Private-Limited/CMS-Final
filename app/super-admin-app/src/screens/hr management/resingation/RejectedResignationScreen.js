/*    ----------------Created Date :: 12- sep -2024    ----------------- */

import {View, SafeAreaView, TouchableOpacity, ToastAndroid} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {getRejectedResignationList} from '../../../redux/slices/hr-management/resignation/getRejectedResignationSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const RejectedResignationScreen = ({navigation}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const rejectedResignatioData = useSelector(
    state => state.getRejectedResignation,
  );

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getRejectedResignationList());
  }, [isFocused]);

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  //  function for Download pdf
  const downloadImageRemote = remoteImagePath => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = remoteImagePath;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/pdf_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Document',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        // setImageModalVisible(false);
        ToastAndroid.show('Download complete', ToastAndroid.LONG);
      });
  };

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  /*function for giveing text of status*/
  function getStatusText(action) {
    switch (action) {
      case '0':
        return 'pending';
      case '1':
        return 'approved';
      case '2':
        return 'rejected';
      default:
        return 'black';
    }
  }

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'savepdf':
        downloadImageRemote(
          'https://www.clickdimensions.com/links/TestPDFfile.pdf',
        );
        break;

      default:
        break;
    }
    return;
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() =>
          navigation.navigate('ResignationDetailScreen', {
            resignationData: item,
          })
        }>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'employee name',
              value: item?.user_name ?? '--',
            },
            {
              key: 'RESIGNATION DATE',
              value:
                `${moment(item?.resignation_date).format('DD/MM/YYYY')}` ??
                '--',
            },
            {
              key: 'LAST DAY OF WORK',
              value:
                `${moment(item?.last_working_day).format('DD/MM/YYYY dddd')}` ??
                '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: getStatusText(item?.resignation_status),
              color: getStatusColor(item?.resignation_status),
            },
          ]}
          action={handleAction}
          savePdfButton={true}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getRejectedResignationList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={{height: WINDOW_HEIGHT * 0.92, width: WINDOW_WIDTH}}>
        <List
          data={rejectedResignatioData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateResignationScreen'}
        />
      </View>
    </SafeAreaView>
  );
};

export default RejectedResignationScreen;

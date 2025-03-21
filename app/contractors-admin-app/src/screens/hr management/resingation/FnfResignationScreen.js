/*    ----------------Created Date :: 12- sep -2024    ----------------- */

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { getFnfList } from '../../../redux/slices/hr-management/resignation/getFnfResignationSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const FnfResignationScreen = ({ navigation }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const FnfData = useSelector(state => state.getFnfResignation);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getFnfList());
  }, [isFocused]);

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

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
    const { config, fs } = RNFetchBlob;
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
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => {
            navigation.navigate('ResignationDetailScreen', {
              resignationData: item,
            });
          }}>
          <CustomeCard
            avatarImage={item?.image}
            allData={item}
            data={[
              {
                key: 'employee name',
                value: item?.user_name ?? '--',
              },
              {
                key: 'Remark',
                value: item?.remarks ?? '--',
              },
              {
                key: 'Generated By',
                value: item?.generated_by ?? '--',
              },
            ]}
            status={[
              { key: 'Status', value: 'fnf Pending', color: Colors().pending },
            ]}
            action={handleAction}
            savePdfButton={true}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getFnfList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ height: WINDOW_HEIGHT * 0.91, width: WINDOW_WIDTH }}>
        <List
          data={FnfData}
          permissions={{ view: true }}
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

export default FnfResignationScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH,
    height: 'auto',
    alignSelf: 'center',
  },
});

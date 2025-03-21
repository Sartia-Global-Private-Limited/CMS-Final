import {StyleSheet, Alert, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import {Icon} from '@rneui/themed';
import IconType from '../constants/IconType';
import {useDispatch} from 'react-redux';
import {getAllComplaintData} from '../redux/slices/commonApi';
import RNFetchBlob from 'rn-fetch-blob';
import {ActivityIndicator} from 'react-native';
import {apiBaseUrl} from '../../config';

const NeumorphLinearGradientCard = ({
  gradientArray,
  lowerTitle,
  lowerValue,
  mainTitle,
  selectedFY,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const dispatch = useDispatch();
  const formatMonthYear = input => {
    const [month, year] = input?.split('-');
    const shortMonth = month?.slice(0, 3);
    return `${shortMonth}-${year}`;
  };

  const fetchExcelData = async () => {
    try {
      const result = await dispatch(
        getAllComplaintData({financial_year: selectedFY, status: status}),
      ).unwrap();
      if (result?.status) {
        downloadFile(result?.filePath);
      } else {
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const downloadFile = async url => {
    try {
      setLoading(true);
      const link = `${apiBaseUrl}${url}`;
      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: RNFetchBlob.fs.dirs.DownloadDir + `/${url}`,
          description: 'file',
        },
      }).fetch('GET', link);

      if (response) {
        setLoading(false);
        Alert.alert('File Saved Successfully');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    fetchExcelData();
  }, [status]);

  const getType = status => {
    switch (status) {
      case 'Total complaints':
        return '';
      case 'Pending complaints':
        return 1;
      case 'Approved complaints':
        return 2;
      case 'Working complaints':
        return 3;
      case 'Rejected complaints':
        return 4;
      case 'Resolved complaints':
        return 5;
      case 'Hold complaints':
        return 6;
      case 'Payment received':
        return 7;
      case '':
        break;
    }
  };

  const getStatus = type => {
    switch (type) {
      case '':
        return 'Total complaints';
      case 1:
        return 'Pending complaints';
      case 2:
        return 'Approved complaints';
      case 3:
        return 'Working complaints';
      case 4:
        return 'Rejected complaints';
      case 5:
        return 'Resolved complaints';
      case 6:
        return 'Hold complaints';
      case 7:
        return 'Payment received';
    }
  };

  const saveFile = async ({status}) => {
    const sts = getType(status);
    setStatus(sts);
  };

  return (
    <Neomorph
      darkShadowColor={Colors().darkShadow2}
      lightShadowColor={Colors().lightShadow}
      style={{
        margin: 5,
        shadowOpacity: 0.3,
        shadowRadius: 15,
        borderRadius: 11,
        borderWidth: 1,
        backgroundColor: Colors().screenBackground,
        width: WINDOW_WIDTH * 0.27,
        height: WINDOW_HEIGHT * 0.125,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors().lightShadow,
      }}>
      <LinearGradient
        colors={gradientArray ? gradientArray : Colors().skyGradient}
        start={{x: 0.01, y: 0}}
        end={{x: 1, y: 1}}
        style={{
          width: WINDOW_WIDTH * 0.27,
          height: WINDOW_HEIGHT * 0.125,
          borderRadius: 11,
        }}
      />
      <View
        style={{
          position: 'absolute',
          padding: 5,
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 20,
            color: Colors().lightShadow,
            fontFamily: Colors().fontFamilyBookMan,
          }}>
          {lowerValue}
        </Text>

        <Text
          style={{
            fontWeight: '700',
            fontSize: 12,
            color: Colors().lightShadow,
            textTransform: 'uppercase',
            fontFamily: Colors().fontFamilyBookMan,
          }}>
          {mainTitle}
        </Text>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 12,
            color: Colors().lightShadow,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: Colors().fontFamilyBookMan,
          }}>
          {lowerTitle && formatMonthYear(lowerTitle)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
          }}>
          {getStatus(status) == mainTitle && loading ? (
            <ActivityIndicator color={Colors().lightShadow} size={'small'} />
          ) : (
            <Icon
              name={'microsoft-excel'}
              type={IconType.MaterialCommunityIcons}
              color={Colors().lightShadow}
              size={25}
              onPress={() => {
                saveFile({status: mainTitle});
              }}
            />
          )}
        </View>
      </View>
    </Neomorph>
  );
};

export default NeumorphLinearGradientCard;

const styles = StyleSheet.create({});

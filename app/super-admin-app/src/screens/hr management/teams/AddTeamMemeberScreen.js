import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MultiSelect} from 'react-native-element-dropdown';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addTeamMemberSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {getAllUserListByTeamId} from '../../../redux/slices/commonApi';
import {addMemberToTeamById} from '../../../redux/slices/hr-management/teams/addUpdateTeamSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import {Avatar} from '@rneui/themed';
import Images from '../../../constants/Images';
import Toast from 'react-native-toast-message';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const AddTeamMemeberScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const teamId = route?.params?.team_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();

  /*declare useState variable here */
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (teamId) {
      fetchUsersData(teamId);
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      team_id: teamId,
      user_id: '',
    },
    validationSchema: addTeamMemberSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      team_id: values.team_id,
      user_id: values.user_id,
    };

    try {
      setLoading(true);
      const addMemberResult = await dispatch(
        addMemberToTeamById({reqBody}),
      ).unwrap();

      if (addMemberResult?.status) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: addMemberResult?.message,
          position: 'bottom',
        });

        navigation.navigate('TemsDeatailScreen', {
          team_id: teamId,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: addMemberResult?.message,
          position: 'bottom',
        });

        setLoading(false);
      }
    } catch (error) {
      console.error('Error in creating order via:', error);
    }
  };

  /*function for fetching User list data*/
  const fetchUsersData = async () => {
    try {
      const result = await dispatch(getAllUserListByTeamId({teamId})).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          ...itm,
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));

        setUserData(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      Toast.show({type: 'error', text1: error, position: 'bottom'});

      setUserData([]);
    }
  };

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[styles.listView, {backgroundColor: Colors().inputLightShadow}]}>
        {item?.image !== undefined && (
          <NeuomorphAvatar gap={4}>
            <Avatar
              size={30}
              rounded
              source={{
                uri: item?.image
                  ? `${apiBaseUrl}${item?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
          </NeuomorphAvatar>
        )}

        {item?.label && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              {marginLeft: 10, color: Colors().pureBlack},
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={label.ADD_TEAM_MEMBER} />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{rowGap: 8}}>
            <MultiSelectComponent
              title={'Team Members'}
              placeHolderTxt={`select team member...`}
              required={true}
              labelField="name"
              valueField="id"
              data={userData}
              value={formik.values.user_id}
              inside={false}
              onChange={e => {
                formik.setFieldValue(`user_id`, e);
              }}
              errorMessage={formik?.errors?.user_id}
            />
          </View>

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit_id ? label.UPDATE : label.ADD}
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

export default AddTeamMemeberScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  dropdown: {
    marginLeft: 10,
    flex: 1,
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

  selectedStyle: {
    borderRadius: 12,
  },
});

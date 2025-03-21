import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { addHrTeamSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllUserWithoutTeam,
} from '../../../redux/slices/commonApi';
import { Avatar } from '@rneui/base';
import { apiBaseUrl } from '../../../../config';
import { Image } from 'react-native';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {
  createTeam,
  updateTeam,
} from '../../../redux/slices/hr-management/teams/addUpdateTeamSlice';
import { getTeamDetail } from '../../../redux/slices/hr-management/teams/getTeamDetailSlice';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import AlertModal from '../../../component/AlertModal';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const AddUpdateTeamScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.team_id;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [modalVisible, setModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [mangerData, setMangerData] = useState([]);
  const [supervisorData, setSupervisorData] = useState([]);
  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetchMangerData();
    if (!edit_id) {
      fetchUsersData();
    }

    if (edit_id) {
      fetchSingleTeamDetails(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      manager_id: edit?.manager_id || '',
      supervisor_id: edit?.supervisor_id || '',
      members: edit.members?.map(itm => itm?.id) || [],
      team_name: edit?.team_name || '',
      team_short_description: edit?.team_short_description || '',
    },
    validationSchema: addHrTeamSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      manager_id: values.manager_id,
      supervisor_id: values.supervisor_id,
      members: values?.members,
      team_name: values.team_name,
      team_short_description: values.team_short_description,
    };

    // return console.log('reqBody', reqBody);
    reqBody['type'] = 1;

    if (edit_id) {
      reqBody['team_id'] = edit_id;
    }
    try {
      if (edit_id) {
        setModalVisible(true);
        setConfrim(reqBody);
      } else {
        setLoading(true);
        const createTeamResult = await dispatch(
          createTeam({ reqBody }),
        ).unwrap();

        if (createTeamResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: createTeamResult?.message,
            position: 'bottom',
          });

          navigation.navigate('TeamListScreen');
        } else {
          Toast.show({
            type: 'error',
            text1: createTeamResult?.message,
            position: 'bottom',
          });

          setLoading(false);
        }
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error, position: 'bottom' });
      console.error('Error in creating order via:', error);
    }
  };

  const updateTeamfunction = async reqBody => {
    setLoading(true);

    const updateTeamResult = await dispatch(updateTeam({ reqBody })).unwrap();

    if (updateTeamResult?.status) {
      setLoading(false);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: updateTeamResult?.message,
        position: 'bottom',
      });

      navigation.navigate('TeamListScreen');
    } else {
      Toast.show({
        type: 'error',
        text1: updateTeamResult?.message,
        position: 'bottom',
      });

      setLoading(false);
      setModalVisible(false);
    }
  };

  const fetchSingleTeamDetails = async teamId => {
    const fetchResult = await dispatch(getTeamDetail({ teamId })).unwrap();
    if (fetchResult?.status) {
      setEdit(fetchResult.data);
      const formatMember = member => ({
        value: member.id,
        label: member.name,
        employee_id: member.employee_id,
        image: member.image,
      });

      hadleTeamMangerChange(fetchResult.data?.manager_id);
      const result = await dispatch(getAllUserWithoutTeam()).unwrap();

      const teamMembers = edit?.team_id ? edit.members?.map(formatMember) : [];
      const usersWithoutTeams = result.data?.map(formatMember);

      const modifiedUserdata = [...usersWithoutTeams, ...teamMembers];

      setUserData(modifiedUserdata);
    } else {
      Toast.show({
        type: 'error',
        text1: fetchResult?.message,
        position: 'bottom',
      });

      setEdit([]);
    }
  };

  /*function for fetching Manger list data*/
  const fetchMangerData = async () => {
    try {
      const result = await dispatch(getAllManger({ team: 1 })).unwrap();
      if (result.status) {
        setMangerData(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setMangerData([]);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error, position: 'bottom' });

      setMangerData([]);
    }
  };
  /*function for fetching Manger list data*/
  const fetchUsersData = async () => {
    try {
      const result = await dispatch(getAllUserWithoutTeam()).unwrap();
      if (result.status) {
        const formatMember = member => ({
          value: member.id,
          label: member.name,
          employee_id: member.employee_id,
          image: member.image,
        });

        const users = result?.data?.map(formatMember);

        setUserData(users);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setUserData([]);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error, position: 'bottom' });

      setUserData([]);
    }
  };

  /*function for fetching supervisor list data*/
  const hadleTeamMangerChange = async managerId => {
    try {
      const result = await dispatch(
        getAllSupervisorByMangaerId({ managerId, type: 1 }),
      ).unwrap();
      if (result.status) {
        setSupervisorData(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setSupervisorData([]);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error, position: 'bottom' });

      setSupervisorData([]);
    }
  };

  const ListItem = item => {
    return (
      <View style={[styles.listView, {}]}>
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

        {item?.name && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.name}
          </Text>
        )}
        {item?.title && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.title}
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
      <CustomeHeader
        headerTitle={edit_id ? label.UPDATE_TEAM : label.ADD_TEAM}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{ rowGap: 2 }}>
            <NeumorphicDropDownList
              title={'Team manger'}
              required={true}
              placeholder={'SELECT Manager ...'}
              data={mangerData}
              labelField={'name'}
              valueField={'id'}
              value={formik?.values?.manager_id}
              renderItem={ListItem}
              style={[styles.inputText, { color: Colors().pureBlack }]}
              onChange={val => {
                formik.setFieldValue(`manager_id`, val?.id);
                hadleTeamMangerChange(val?.id);
              }}
              errorMessage={formik?.errors?.manager_id}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <NeumorphicDropDownList
              title={'TEAM SUPERVISOR'}
              required={true}
              placeholder={'SELECT ...'}
              data={supervisorData}
              labelField={'name'}
              valueField={'id'}
              value={formik?.values?.supervisor_id}
              renderItem={ListItem}
              activeColor={Colors().skyBule}
              onChange={val => {
                formik.setFieldValue(`supervisor_id`, val?.id);
              }}
              errorMessage={formik?.errors?.supervisor_id}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <MultiSelectComponent
              title={'TEAM MEMBERS'}
              placeHolderTxt={'members'}
              required={true}
              data={userData}
              value={formik?.values?.members}
              inside={false}
              onChange={item => {
                formik.setFieldValue(`members`, item);
              }}
              errorMessage={formik?.errors?.members}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <NeumorphicTextInput
              title={'Team Name'}
              required={true}
              placeHolderTxt={'TYPE...'}
              placeHolderTxtColor={Colors().pureBlack}
              style={[styles.inputText, { color: Colors().gray2 }]}
              value={formik?.values?.team_name}
              onChangeText={formik.handleChange('team_name')}
              errorMessage={formik.errors.team_name}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <NeumorphicTextInput
              title={'DESCRIPTION'}
              placeHolderTxt={'TYPE...'}
              style={[styles.inputText, { color: Colors().gray2 }]}
              value={formik?.values?.team_short_description}
              numberOfLines={2}
              multiline={true}
              onChangeText={formik.handleChange('team_short_description')}
            />
          </View>

          {/* modal view for delete*/}
          {setModalVisible && (
            <AlertModal
              visible={modalVisible}
              iconName={'edit'}
              icontype={IconType.FontAwesome}
              iconColor={Colors().red}
              textToShow={' ARE YOU SURE YOU WANT TO Update THIS!!'}
              cancelBtnPress={() => setModalVisible(false)}
              ConfirmBtnPress={() => updateTeamfunction(confirm)}
            />
          )}

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
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

export default AddUpdateTeamScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
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

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',

    margin: 3,
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
    fontSize: 15,
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

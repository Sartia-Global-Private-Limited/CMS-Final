import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../component/SearchBar';
import FloatingAddButton from '../../component/FloatingAddButton';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import SeparatorComponent from '../../component/SeparatorComponent';
import { Neomorph } from 'react-native-neomorph-shadows';
import { Icon } from '@rneui/base';
import { getAllRolesForSuperAdmin } from '../../redux/slices/allRolesSlice';
import moment from 'moment';

const AllRolesScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState([
    {
      name: 'John Doe',
      date: '2023-12-11',
    },
    {
      name: 'John Doe',
      date: '2023-12-11',
    },
    {
      name: 'John Doe',
      date: '2023-12-11',
    },
    {
      name: 'John Doe',
      date: '2023-12-11',
    },
    {
      name: 'John Doe',
      date: '2023-12-11',
    },
  ]);

  const headerTitle = route?.params?.title;
  //   const company_id = route?.params?.company_id;
  const allRoles = useSelector(state => state.allRoles);
  const allRolesData = allRoles?.data?.data;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRolesForSuperAdmin());
  }, []);

  const renderItem = ({ item }) => {
    const fomattedDate = moment(item?.created_at).format('DD - MM - YYYY');
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('CompaniesDetailsScreen', {
            title: 'Company Detail',
            company_id: item?.company_id,
          })
        }>
        <Neomorph
          darkShadowColor={Colors().darkShadow} // <- set this
          lightShadowColor={Colors().lightShadow} // <- this
          style={styles.shadow}>
          <View
            style={{
              margin: WINDOW_WIDTH * 0.03,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.cardHeadingTxt}>Date : </Text>
                <Text style={styles.cardtext}>{fomattedDate}</Text>
              </View>
              <View>
                <Pressable
                  onPress={() => navigation.navigate('ViewPermissionsScreen')}>
                  <Text
                    style={[styles.cardHeadingTxt, { color: Colors().aprroved }]}>
                    View Permissions{' >>'}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.cardHeadingTxt}>Roles : </Text>
              <Text numberOfLines={1} style={styles.cardtext}>
                {item?.name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Icon
              name="edit"
              type={IconType.Feather}
              color={Colors().edit}
              onPress={() => navigation.navigate('AddUpdateRoleScreen')}
              style={{
                marginBottom: 10,
                marginRight: 10,
              }}
            />
            <Icon
              name="delete"
              type={IconType.AntDesign}
              color={Colors().red}
              onPress={() => Alert.alert('delete')}
              style={{
                marginBottom: 10,
                marginRight: 10,
              }}
            />
          </View>
        </Neomorph>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={headerTitle} />

      {allRoles?.isLoading ? (
        <Loader />
      ) : !allRoles?.isLoading &&
        !allRoles?.isError &&
        allRoles?.data?.status ? (
        <>
          <View>
            <SearchBar
              searchWidth={WINDOW_WIDTH * 0.8}
              onChangeText={val => {
                setSearchText(val), searchByName(val);
              }}
              placeholderText={'Search Companies...'}
              value={searchText}
              onRightIconPress={() => setSearchText('')}
            />
            <SeparatorComponent
              separatorWidth={0.2}
              separatorColor={Colors().darkShadow2}
            />

            <View style={{}}>
              <FlatList
                data={allRolesData}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 200 }}
              />
            </View>

            {/* View for floating button */}
            <View
              style={{
                marginTop: WINDOW_HEIGHT * 0.7,
                marginLeft: WINDOW_WIDTH * 0.8,
                position: 'absolute',
              }}>
              <FloatingAddButton
                backgroundColor={Colors().purple}
                onPress={() => {
                  navigation.navigate('AddUpdateRoleScreen'),
                    { title: headerTitle };
                }}></FloatingAddButton>
            </View>
          </View>
        </>
      ) : allRoles?.isError ? (
        <InternalServer />
      ) : !allRoles?.data?.status &&
        allRoles?.data?.message === 'Data not found' ? (
        <>
          <Text>data not found block</Text>
        </>
      ) : (
        <Text>{allRoles?.data?.message} </Text>
      )}
    </SafeAreaView>
  );
};

export default AllRolesScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 1, // <- and this or yours opacity
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: Colors().cardBackground,
    width: WINDOW_WIDTH * 0.9,
    height: WINDOW_HEIGHT * 0.15,
  },
  cardContainer: {
    flex: 1,
    // backgroundColor: 'red',
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    paddingVertical: WINDOW_HEIGHT * 0.01,
  },
  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
  },
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    flexShrink: 1,
    marginLeft: 2,
  },
});

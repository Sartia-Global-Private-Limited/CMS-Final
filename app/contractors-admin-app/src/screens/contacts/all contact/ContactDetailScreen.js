import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import { getContactDetailById } from '../../../redux/slices/contacts/all contact/getCompanyContactDetailSlice';
import { DataTable } from 'react-native-paper';

const ContactDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getCompanyContactDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getContactDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getContactDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.CONTACT} ${label.DETAIL}`} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{}}>
              {/* card for company detail */}
              <CustomeCard
                headerName={'Company DETAILS'}
                data={[
                  {
                    key: 'company name',
                    value: all_Data?.company_name ?? '--',
                  },
                  {
                    key: 'company type',
                    value: all_Data?.company_type_name ?? '--',
                  },
                  {
                    key: 'contact id',
                    value: all_Data?.contact_unique_id ?? '--',
                  },
                  {
                    key: 'company address',
                    value: all_Data?.company_address ?? '--',
                  },
                ]}
              />
              {/* card for contact detail */}
              <CustomeCard
                headerName={'DETAILS'}
                data={[
                  {
                    key: 'First name',
                    value: all_Data?.first_name ?? '--',
                  },
                  {
                    key: 'last name',
                    value: all_Data?.last_name ?? '--',
                  },
                  {
                    key: 'contact id',
                    value: all_Data?.contact_unique_id ?? '--',
                  },
                  {
                    key: 'position',
                    value: all_Data?.position ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: all_Data?.status == '1' ? 'active' : 'inactive',
                    color:
                      all_Data?.status == '1'
                        ? Colors().aprroved
                        : Colors().red,
                  },
                ]}
              />
              {/* card for Phone detail */}
              <CustomeCard
                headerName={'Phone'}
                data={[
                  {
                    component: (
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{ columnGap: 10 }}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 50 }]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              phone
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              primary
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {all_Data?.phone?.map((itm, index) => (
                              <>
                                <DataTable.Row key={index} style={{}}>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {
                                        width: 50,
                                      },
                                    ]}>
                                    <View style={styles.tableHeadingView}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          { color: Colors().pureBlack },
                                        ]}>
                                        {index + 1}
                                      </Text>
                                    </View>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.number}
                                    </Text>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        {
                                          color:
                                            itm?.primary == '1'
                                              ? Colors().aprroved
                                              : Colors().red,
                                        },
                                      ]}>
                                      {itm?.primary == '1'
                                        ? 'active'
                                        : 'de-active'}
                                    </Text>
                                  </DataTable.Cell>
                                </DataTable.Row>
                              </>
                            ))}
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    ),
                  },
                ]}
              />

              {/* card for email detail */}
              <CustomeCard
                headerName={'email'}
                data={[
                  {
                    component: (
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{ columnGap: 10 }}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 50 }]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 150 }]}>
                              email
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              primary
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {all_Data?.email?.map((itm, index) => (
                              <>
                                <DataTable.Row key={index} style={{}}>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {
                                        width: 50,
                                      },
                                    ]}>
                                    <View style={styles.tableHeadingView}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          { color: Colors().pureBlack },
                                        ]}>
                                        {index + 1}
                                      </Text>
                                    </View>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 150 },
                                    ]}>
                                    <Text
                                      numberOfLines={3}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.email}
                                    </Text>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        {
                                          color:
                                            itm?.primary == '1'
                                              ? Colors().aprroved
                                              : Colors().red,
                                        },
                                      ]}>
                                      {itm?.primary == '1'
                                        ? 'active'
                                        : 'de-active'}
                                    </Text>
                                  </DataTable.Cell>
                                </DataTable.Row>
                              </>
                            ))}
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    ),
                  },
                ]}
              />
              {/* card for contact detail */}
              <CustomeCard
                headerName={'external field'}
                data={[
                  {
                    key: 'Notes',
                    value: all_Data?.notes ?? '--',
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default ContactDetailScreen;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },

  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

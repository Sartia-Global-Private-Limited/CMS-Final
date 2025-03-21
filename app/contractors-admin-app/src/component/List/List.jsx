import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import InternalServer from '../InternalServer';
import Loader from '../Loader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import Colors from '../../constants/Colors';
import DataNotFound from '../DataNotFound';
import FloatingAddButton from '../FloatingAddButton';
import { useNavigation } from '@react-navigation/native';
import usePermission from '../../hooks/usePermission';
import Pagination from './Pagination';

const List = ({
  data,
  renderItem,
  listStyle,
  apiFunctions,
  setPageNo,
  pageNo,
  addAction,
  addFunction,
  ListFooterComponent,
}) => {
  const navigation = useNavigation();
  const { permissions } = usePermission({});
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);

  useEffect(() => {
    apiFunctions();
  }, [pageNo]);

  // Handle loading the next page
  const handleLoadNextPage = () => {
    if (
      !isFetchingNextPage &&
      !data?.isLoading &&
      data?.data?.pageDetails?.totalPages > data?.data?.pageDetails?.currentPage
    ) {
      setIsFetchingNextPage(true);
      setPageNo(pageNo + 1);
      // console.log('Page No For Next', pageNo);
    }
  };

  // Handle loading the previous page
  const handleLoadPreviousPage = () => {
    if (
      !isFetchingPreviousPage &&
      !data?.isLoading &&
      data?.data?.pageDetails?.currentPage >= 1
    ) {
      setIsFetchingPreviousPage(true);
      if (pageNo > 1) {
        setPageNo(pageNo - 1);
        // console.log('Page No For Previous', pageNo);
      }
    }
  };

  useEffect(() => {
    if (isFetchingNextPage) setIsFetchingNextPage(false);
    if (isFetchingPreviousPage) setIsFetchingPreviousPage(false);
  }, [data]);

  return (
    <View
      style={[
        styles.container,
        { listStyle, backgroundColor: Colors()?.screenBackground },
      ]}>
      {data?.isLoading && pageNo === 1 ? (
        <View
          style={{
            width: WINDOW_WIDTH,
            backgroundColor: Colors()?.screenBackground,
            height: WINDOW_HEIGHT * 0.85,
          }}>
          <Loader />
        </View>
      ) : data?.isError ? (
        <View
          style={{
            width: WINDOW_WIDTH,
            backgroundColor: Colors()?.screenBackground,
            height: WINDOW_HEIGHT * 0.85,
          }}>
          <InternalServer />
        </View>
      ) : permissions?.view === 0 ? (
        <View
          style={{
            marginTop: 150,
            width: 300,
            height: 300,
            alignSelf: 'center',
            gap: 15,
          }}>
          <Image
            style={{ width: 300, height: 300, borderRadius: 10 }}
            source={require('../../assests/images/access_denied.png')}
          />
          <Text
            style={{
              color: Colors().rejected,
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            You Don't Have Permissions To Access This Item
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={data?.isLoading}
              onRefresh={apiFunctions}
            />
          }
          contentContainerStyle={[
            listStyle,
            {
              width: WINDOW_WIDTH,
              height: 'auto',
              backgroundColor: Colors()?.screenBackground,
              paddingBottom: 100,
            },
          ]}
          ListFooterComponent={ListFooterComponent}
          data={data?.data?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item?.id}
          onEndReached={() => {
            handleLoadNextPage();
          }}
          onStartReached={() => {
            handleLoadPreviousPage();
          }}
          // onStartReachedThreshold={0.1}
          // onEndReachedThreshold={0.1}
          // Trigger when 10% of the list is left
          // onScroll={handleScroll}
          ListEmptyComponent={
            <View
              style={{
                height: WINDOW_HEIGHT * 0.8,
              }}>
              {permissions?.view === 0 ? (
                <View
                  style={{
                    marginTop: 150,
                    width: 300,
                    height: 300,
                    alignSelf: 'center',
                    gap: 15,
                  }}>
                  <Image
                    style={{ width: 300, height: 300, borderRadius: 10 }}
                    source={require('../../assests/images/access_denied.png')}
                  />
                  <Text
                    style={{
                      color: Colors().rejected,
                      fontSize: 18,
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    You Don't Have Permissions To Access This Item
                  </Text>
                </View>
              ) : (
                <DataNotFound />
              )}
            </View>
          }
        />
      )}
      {(addFunction || addAction) && !data?.isLoading && (
        <View
          style={{ zIndex: 1, position: 'absolute', bottom: 250, right: 80 }}>
          {permissions?.create === 1 && (
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={
                addFunction
                  ? addFunction
                  : () => {
                      navigation.navigate(addAction);
                    }
              }
            />
          )}
        </View>
      )}
      {data?.isLoading ||
        (apiFunctions && permissions?.view === 1 && (
          <View
            style={{
              pasition: 'absolute',
              bottom: 80,
              height: 60,
            }}>
            <Pagination
              setPageNo={setPageNo}
              ListData={data?.data}
              pageNo={pageNo}
              apiFunctions={apiFunctions}
            />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: WINDOW_WIDTH,
    paddingBottom: 60,
    backgroundColor: Colors().screenBackground,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

export default List;

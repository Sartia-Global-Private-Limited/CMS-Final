import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import Pagination from './Pagination';
import InternalServer from '../InternalServer';
import Loader from '../Loader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import Colors from '../../constants/Colors';
import DataNotFound from '../DataNotFound';
import FloatingAddButton from '../FloatingAddButton';
import {useNavigation} from '@react-navigation/native';
import usePermission from '../../hooks/usePermission';

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
  const {permissions} = usePermission({});
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleEndReached = () => {
    if (!isFetchingMore && pageNo <= data?.data?.pageDetails?.totalPages) {
      setIsFetchingMore(true);
      setPageNo(prev => prev + 1);
      apiFunctions();
    }
  };

  const handleStartReached = () => {
    if (!isFetchingMore && pageNo > 1) {
      setIsFetchingMore(true);
      setPageNo(prev => prev - 1);
      apiFunctions();
    }
  };

  useEffect(() => {}, [pageNo, data]);

  return (
    <View
      style={[
        styles.container,
        {listStyle, backgroundColor: Colors()?.screenBackground},
      ]}>
      {data?.isLoading ? (
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
            style={{width: 300, height: 300, borderRadius: 10}}
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
          onEndReached={handleEndReached}
          // onEndReachedThreshold={0.5}
          onScrollBeginDrag={() => setIsFetchingMore(false)}
          onStartReached={handleStartReached}
          contentContainerStyle={[
            listStyle,
            {
              width: WINDOW_WIDTH,
              backgroundColor: Colors()?.screenBackground,
            },
          ]}
          ListFooterComponent={ListFooterComponent && ListFooterComponent}
          data={data?.data?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item?.id}
          ListEmptyComponent={
            <View
              style={{
                height: WINDOW_HEIGHT * 0.8,
              }}>
              {permissions?.view == 0 ? (
                <View
                  style={{
                    marginTop: 150,
                    width: 300,
                    height: 300,
                    alignSelf: 'center',
                    gap: 15,
                  }}>
                  <Image
                    style={{width: 300, height: 300, borderRadius: 10}}
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
              {/* {(addFunction || addAction) && (
                <View
                  style={{
                    zIndex: 1,
                    position: 'absolute',
                    bottom: 250,
                    right: 80,
                  }}>
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
                </View>
              )} */}
            </View>
          }
        />
      )}
      {data?.isLoading ||
        ((addFunction || addAction) && (
          <View
            style={{zIndex: 1, position: 'absolute', bottom: 250, right: 80}}>
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
        ))}
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
  },
});

export default List;

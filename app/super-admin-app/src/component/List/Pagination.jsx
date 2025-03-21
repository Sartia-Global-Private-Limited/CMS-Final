import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const Pagination = ({ListData, apiFunctions, setPageNo, pageNo}) => {
  const buttons = [];

  const handlePageClick = number => {
    setPageNo(number);
    apiFunctions();
  };

  for (
    let i =
      +ListData?.pageDetails?.currentPage > 1
        ? +ListData?.pageDetails?.currentPage - 1
        : +ListData?.pageDetails?.currentPage;
    i <=
    (+ListData?.pageDetails?.totalPages === +ListData?.pageDetails?.currentPage
      ? +ListData?.pageDetails?.currentPage
      : +ListData?.pageDetails?.currentPage + 1);
    i++
  ) {
    buttons.push(
      <TouchableOpacity
        key={i}
        onPress={() => handlePageClick(i)}
        style={[
          styles.paginationButton,
          i === pageNo ? styles.activeButton : null,
        ]}>
        <Text style={{color: 'white'}}>{i}</Text>
      </TouchableOpacity>,
    );
  }

  return (
    <SafeAreaView
      style={{
        alignSelf: 'center',
        paddingHorizontal: 10,
      }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {buttons}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: '#22c55d',
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
});

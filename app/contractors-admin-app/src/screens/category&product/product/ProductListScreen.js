import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import { useFormik } from 'formik';
import { selectUser } from '../../../redux/slices/authSlice';
import { getAllProduct } from '../../../redux/slices/category&product/product/getProductListSlice';
import {
  deleteProductById,
  updateProductStatus,
} from '../../../redux/slices/category&product/product/addUpdateProductSlice';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const ProductListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const empListData = useSelector(state => state.getProductList);
  const { user } = useSelector(selectUser);

  /*declare useState variable here */
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productId, setProdcuctId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllProduct({ pageSize: pageSize, pageNo: pageNo, search: searchText }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteProduct = async Id => {
    try {
      const deleteResult = await dispatch(deleteProductById(Id)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setProdcuctId('');
        dispatch(getAllProduct({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setProdcuctId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setProdcuctId('');
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      status: '',
    },
    // validationSchema: addRemarkSchema,
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      product_id: values.id,
      // remark: values.remark,
      // updated_by: user.id,
      value: values.status,
    };

    try {
      const updateStausResult = await dispatch(
        updateProductStatus(reqBody),
      ).unwrap();

      if (updateStausResult?.status) {
        Toast.show({
          type: 'success',
          text1: updateStausResult?.message,
          position: 'bottom',
        });
        // navigation.navigate('ProductListScreen');
        setStatusModalVisible(false);
        dispatch(getAllProduct({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'success',
          text1: updateStausResult?.message,
          position: 'bottom',
        });
        setStatusModalVisible(false);
      }
    } catch (error) {
      setStatusModalVisible(false);
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'In Stock';

      case '2':
        return 'Out of Stock';

      default:
        break;
    }
  }

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateProductScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setProdcuctId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetailScreen', {
              id: item?.id,
            })
          }>
          <CustomeCard
            allData={item}
            avatarImage={item?.image_url}
            data={[
              {
                key: 'Product name',
                value: item?.product_name ?? '--',
                keyColor: Colors().skyBule,
              },
              { key: 'category', value: item?.category_name },
              { key: 'SUPPLIER NAME', value: item?.supplier_name },
              {
                key: 'Price',
                value: `	₹ ${item?.price}`,
                keyColor: Colors().aprroved,
              },

              {
                key: 'quantity',
                value: `${item?.quantity}`,
                keyColor: Colors().red,
              },
              {
                key: 'AVAIL. STATUS',
                value: getStatusText(item?.availability_status),
                keyColor: getStatusColor(item?.availability_status),
              },
            ]}
            status={[
              {
                key: 'published',
                component: (
                  <NeumorphCard>
                    <View style={{ padding: 5 }}>
                      <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={
                          item?.is_published === '1' ? '#f5dd4b' : '#f4f3f4'
                        }
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                          setStatusModalVisible(true);
                          formik.setFieldValue(`id`, item?.id);
                          formik.setFieldValue(
                            `status`,
                            item?.is_published == '1' ? '0' : '1',
                          );
                        }}
                        value={item?.is_published === '1' ? true : false}
                      />
                    </View>
                  </NeumorphCard>
                ),
              },
            ]}
            editButton={true}
            deleteButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllProduct({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.PRODUCT}`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={empListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateProductScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteProduct(productId)}
        />
      )}

      {statusModalVisible && (
        <AlertModal
          visible={statusModalVisible}
          iconName={'clock-edit-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
          cancelBtnPress={() => setStatusModalVisible(!statusModalVisible)}
          ConfirmBtnPress={() => formik.handleSubmit()}
        />
      )}
    </SafeAreaView>
  );
};

export default ProductListScreen;

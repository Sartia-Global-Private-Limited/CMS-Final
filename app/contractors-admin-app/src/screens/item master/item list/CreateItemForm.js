/*    ----------------Created Date :: 6 - August -2024   ----------------- */
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllBrand,
  getAllSupplier,
  getAllUnit,
} from '../../../redux/slices/commonApi';
import {Icon} from '@rneui/themed';
import IconType from '../../../constants/IconType';
import Fileupploader from '../../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import CardDropDown from '../../../component/CardDropDown';
import CardTextInput from '../../../component/CardTextInput';
import NeumorphCard from '../../../component/NeumorphCard';
import converToString from '../../../utils/NumberToString';
import {getItemMasterListWithCategory} from '../../../redux/slices/item master/item master/getItemMasterListSlice';

const CreateItemForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();
  const ItemsList = useSelector(state => state.getItemMasterList);

  const refRBSheet = useRef(RBSheet);
  const itemTypeData = [
    {label: 'fund', value: 'fund'},
    {label: 'stock', value: 'stock'},
  ];
  const [allSupplier, setAllSupplier] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allUnit, setAllUnit] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    fetchAllSupplier();
    fetchAllUnit();
    fetchAllBrand();
    dispatch(
      getItemMasterListWithCategory({
        isDropdown: true,
      }),
    );
  }, []);

  useEffect(() => {
    const rData = ItemsList?.data?.data?.map(itm => {
      return {
        label: itm?.name,
        value: itm?.name,
      };
    });
    setAllItems(rData);
  }, [ItemsList]);

  /*fucnction for fetching all Supplier*/
  const fetchAllSupplier = async () => {
    const result = await dispatch(getAllSupplier()).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.supplier_name,
          value: itm?.id,
        };
      });
      setAllSupplier(rData);
    } else {
      setAllSupplier([]);
    }
  };

  /*fucnction for fetching all unit */
  const fetchAllUnit = async () => {
    const result = await dispatch(getAllUnit()).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.id,
        };
      });
      setAllUnit(rData);
    } else {
      setAllUnit([]);
    }
  };

  /*fucnction for fetching all brand */
  const fetchAllBrand = async () => {
    const result = await dispatch(getAllBrand()).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.brand_name,
          value: itm?.id,
        };
      });
      setAllBrand(rData);
    } else {
      setAllBrand([]);
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'image':
        refRBSheet.current.open();
        break;

      default:
        break;
    }
  };

  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Item detail'}
        avatarImage={
          edit_id && typeof formik?.values?.image == 'string'
            ? formik?.values?.image
            : formik?.values?.image?.uri
        }
        data={[
          {
            key: 'name',
            component: (
              <CardDropDown
                data={allItems || []}
                required={true}
                value={formik?.values?.name}
                onChange={val => {
                  formik?.setFieldValue(`name`, val?.value);
                }}
              />
            ),
          },
          {
            key: 'spplier name',
            component: (
              <CardDropDown
                data={allSupplier}
                required={true}
                value={formik?.values?.supplier_id}
                onChange={val => {
                  formik?.setFieldValue(`supplier_id`, val?.value);
                }}
              />
            ),
          },
          {
            key: 'unit name',
            component: (
              <CardDropDown
                data={allUnit}
                required={true}
                value={formik?.values?.unit_id}
                onChange={val => {
                  formik?.setFieldValue(`unit_id`, val?.value);
                }}
              />
            ),
          },
          {
            key: 'HSNcode',
            component: (
              <CardTextInput
                value={formik?.values?.hsncode}
                required={true}
                onChange={text => formik?.setFieldValue(`hsncode`, text)}
              />
            ),
          },
          {
            key: 'rucode',
            component: (
              <CardTextInput
                value={formik?.values?.rucode}
                required={true}
                onChange={text => formik?.setFieldValue(`rucode`, text)}
              />
            ),
          },

          {
            key: 'item category',
            component: (
              <CardDropDown
                data={itemTypeData}
                required={true}
                value={formik?.values?.category}
                onChange={val => {
                  formik?.setFieldValue(`category`, val?.value);
                }}
              />
            ),
          },
          {
            key: 'item unique id',
            component: (
              <CardTextInput
                editable={edit_id ? false : true}
                value={converToString(formik?.values?.item_unique_id)}
                onChange={text => formik?.setFieldValue(`item_unique_id`, text)}
              />
            ),
          },
          {
            key: 'description',
            component: (
              <CardTextInput
                value={formik?.values?.description}
                onChange={text => formik?.setFieldValue(`description`, text)}
              />
            ),
          },
        ]}
        status={[{key: 'action', value: 'select  image'}]}
        action={handleAction}
        imageButton={true}
      />

      {formik?.values?.rates?.map((item, index) => {
        return (
          <View>
            {index >= 1 && (
              <View style={styles.crossIcon}>
                <Icon
                  name="close"
                  type={IconType.AntDesign}
                  color={Colors().inputLightShadow}
                  size={12}
                  onPress={() =>
                    formik.setFieldValue(
                      `rates`,
                      formik.values.rates.filter((_, i) => i !== index),
                    )
                  }
                />
              </View>
            )}

            <CustomeCard
              allData={{index, item}}
              data={[
                {
                  key: 'Brand',
                  component: (
                    <CardDropDown
                      data={allBrand}
                      value={item?.brand_id}
                      onChange={val => {
                        formik?.setFieldValue(
                          `rates.${index}.brand_id`,
                          val?.value,
                        );
                        formik?.setFieldValue(
                          `rates.${index}.brand`,
                          val?.label,
                        );
                      }}
                    />
                  ),
                },

                {
                  key: 'rate',
                  component: (
                    <CardTextInput
                      value={item?.rate ? converToString(item?.rate) : ''}
                      onChange={text =>
                        formik?.setFieldValue(`rates.${index}.rate`, text)
                      }
                      keyboardType="numeric"
                    />
                  ),
                },
              ]}
            />
          </View>
        );
      })}
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: 10,
        }}>
        <NeumorphCard
          lightShadowColor={Colors().darkShadow2}
          darkShadowColor={Colors().lightShadow}>
          <Icon
            name="plus"
            type={IconType.AntDesign}
            color={Colors().aprroved}
            style={styles.actionIcon}
            onPress={() => {
              formik.setFieldValue(`rates`, [
                ...formik.values.rates,
                {brand: '', brand_id: '', rate: ''},
              ]);
            }}
          />
        </NeumorphCard>
        <Text
          style={[
            styles.title,
            {
              alignSelf: 'center',
              marginLeft: 10,
              color: Colors().aprroved,
            },
          ]}>
          add brand
        </Text>
      </View>

      <Fileupploader
        btnRef={refRBSheet}
        cameraOption={{
          base64: false,
          multiselet: false,
        }}
        cameraResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`image`, imageFormData);
          refRBSheet.current.close();
        }}
        galleryOption={{base64: false, multiselet: false}}
        galleryResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`image`, imageFormData);
          refRBSheet.current.close();
        }}
      />
    </View>
  );
};

export default CreateItemForm;

const styles = StyleSheet.create({
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});

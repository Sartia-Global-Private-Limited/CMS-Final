import {StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import {useDispatch} from 'react-redux';
import NeumorphCard from '../../component/NeumorphCard';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphicButton from '../../component/NeumorphicButton';
import {
  getAllModuleByRoleId,
  postRolesPermissions,
} from '../../services/authApi';
import Toast from 'react-native-toast-message';

import Loader from '../../component/Loader';
import {CheckBox} from '@rneui/base';

const ViewPermissionsScreen = ({route}) => {
  const id = route?.params?.id;
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllModulesData();
  }, []);

  const fetchAllModulesData = async () => {
    setLoadingData(true);
    try {
      const res = await getAllModuleByRoleId(id);
      if (res.status) {
        setLoadingData(false);
        setModules(res.data);
      } else {
        setLoadingData(false);
        setModules([]);
      }
    } catch (error) {
      setLoadingData(false);
      console.log('error', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const sData = {
      moduleName: modules,
      role_id: id,
    };
    try {
      // return console.log("sData", sData);
      const res = await postRolesPermissions(sData);
      if (res.status) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        // dispatch(setUserPermission(sData.moduleName));
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      console.log('error', error);
    }
  };

  const permissions = ['create', 'update', 'view', 'delete'];

  // CheckboxRow component to encapsulate checkboxes
  const CheckboxRow = React.memo(({checked, onChange, label}) => {
    return (
      <View style={{padding: 5, flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          checked={checked}
          onPress={() => onChange()}
          containerStyle={{
            backgroundColor: 'transparent',
            alignSelf: 'center',
            padding: 0,
            margin: 0,
          }}
          uncheckedColor={Colors().black2}
          checkedColor={Colors().purple}
          textStyle={{textTransform: 'uppercase', color: Colors().black2}}
        />
        <Text
          style={{
            textTransform: 'uppercase',
            fontFamily: Colors().fontFamilyBookMan,
            color: Colors().black2,
          }}>
          {label}
        </Text>
      </View>
    );
  });

  // Optimized update function to avoid deep copy of entire state
  const updatePermission = useCallback(
    (moduleId, permissionType, submoduleId, nestedSubmoduleId) => {
      setModules(prevModules =>
        prevModules.map(module => {
          if (module.id === moduleId) {
            // Handle module level permission update
            if (!submoduleId) {
              return {
                ...module,
                [permissionType]: module[permissionType] === 1 ? 0 : 1,
              };
            }

            // Handle submodule level permission update
            const updatedSubmodules = module.submodules.map(submodule => {
              if (submodule.id === submoduleId) {
                if (!nestedSubmoduleId) {
                  return {
                    ...submodule,
                    [permissionType]: submodule[permissionType] === 1 ? 0 : 1,
                  };
                }

                // Handle nested submodule permission update
                const updatedNestedSubmodules =
                  submodule.modulesOfSubModule.map(nestedSubmodule => {
                    if (nestedSubmodule.id === nestedSubmoduleId) {
                      return {
                        ...nestedSubmodule,
                        [permissionType]:
                          nestedSubmodule[permissionType] === 1 ? 0 : 1,
                      };
                    }
                    return nestedSubmodule;
                  });

                return {
                  ...submodule,
                  modulesOfSubModule: updatedNestedSubmodules,
                };
              }
              return submodule;
            });

            return {
              ...module,
              submodules: updatedSubmodules,
            };
          }
          return module;
        }),
      );
    },
    [],
  );

  const renderNestedModules = useCallback(
    ({item}) => {
      return (
        <View style={{margin: 10}}>
          <NeumorphCard>
            <View
              style={{
                width: WINDOW_WIDTH * 0.9,
                padding: 15,
              }}>
              <Text
                style={{
                  color: Colors().purple,
                  fontSize: 16,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  fontFamily: Colors().fontFamilyBookMan,
                }}>
                {item.id}. {item.title}
              </Text>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 5,
                  height: 'auto',
                  flexWrap: 'wrap',
                  width: WINDOW_WIDTH * 0.6,
                  paddingTop: 5,
                  paddingLeft: 10,
                }}>
                {permissions.map(el => (
                  <CheckboxRow
                    key={el}
                    label={el}
                    checked={item[el] == 1}
                    onChange={() => updatePermission(item.id, el)}
                  />
                ))}
              </View>
              <View
                style={{
                  width: WINDOW_WIDTH * 0.9,
                  padding: 10,
                }}>
                {item?.submodules?.length > 0 && (
                  <FlatList
                    data={item.submodules}
                    keyExtractor={submodule => submodule.id.toString()}
                    renderItem={({item: submodule}) => (
                      <View
                        style={{
                          margin: 5,
                          alignSelf: 'flex-end',
                          width: WINDOW_WIDTH * 0.8,
                          padding: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: 10,
                          borderColor: Colors().black2,
                          borderWidth: 0.5,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 15,
                            paddingTop: 5,
                            paddingLeft: 10,
                            textTransform: 'uppercase',
                            fontFamily: Colors().fontFamilyBookMan,
                          }}>
                          {submodule?.id}. {submodule.title}
                        </Text>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            gap: 5,
                            height: 'auto',
                            flexWrap: 'wrap',
                            width: WINDOW_WIDTH * 0.6,
                            paddingTop: 5,
                            paddingLeft: 10,
                          }}>
                          {permissions.map(el => (
                            <CheckboxRow
                              key={el}
                              label={el}
                              checked={submodule[el] == 1}
                              onChange={() =>
                                updatePermission(item.id, el, submodule.id)
                              }
                            />
                          ))}
                        </View>
                        {submodule?.modulesOfSubModule?.length > 0 && (
                          <FlatList
                            data={submodule.modulesOfSubModule}
                            keyExtractor={nestedModule =>
                              nestedModule.id.toString()
                            }
                            renderItem={({item: nestedModule, i}) => (
                              <View
                                style={{
                                  width: WINDOW_WIDTH * 0.7,
                                  padding: 8,
                                  alignSelf: 'flex-end',
                                  borderColor: Colors().black2,
                                  borderWidth: 0.5,
                                  borderRadius: 12,
                                  marginTop: 10,
                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 15,
                                    paddingTop: 5,
                                    paddingLeft: 10,
                                    textTransform: 'uppercase',
                                    fontFamily: Colors().fontFamilyBookMan,
                                  }}>
                                  {nestedModule?.id}. {nestedModule.title}
                                </Text>
                                <View
                                  style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    gap: 5,
                                    height: 'auto',
                                    flexWrap: 'wrap',
                                    width: WINDOW_WIDTH * 0.6,
                                    paddingTop: 5,
                                    paddingLeft: 10,
                                  }}>
                                  {permissions.map(el => (
                                    <CheckboxRow
                                      key={el}
                                      label={el}
                                      checked={nestedModule[el] == 1}
                                      onChange={() =>
                                        updatePermission(
                                          item.id,
                                          el,
                                          submodule.id,
                                          nestedModule.id,
                                        )
                                      }
                                    />
                                  ))}
                                </View>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          </NeumorphCard>
        </View>
      );
    },
    [permissions, updatePermission],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'Permissions'} />
      {loadingData ? (
        <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT}}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={modules}
          contentContainerStyle={{paddingBottom: 50}}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNestedModules}
          initialNumToRender={5}
          windowSize={10}
          ListFooterComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <NeumorphicButton
                loading={loading}
                title={'Save'}
                titleColor={Colors().aprroved}
                btnRadius={10}
                btnWidth={WINDOW_WIDTH * 0.3}
                onPress={() => {
                  handleSubmit();
                }}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ViewPermissionsScreen;

const styles = StyleSheet.create({});

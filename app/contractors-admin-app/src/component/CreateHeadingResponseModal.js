import React from 'react';
import {FieldArray, Formik} from 'formik';
import {Modal, StyleSheet, Text} from 'react-native';
import NeumorphicDropDownList from './DropDownList';
import NeumorphicTextInput from './NeumorphicTextInput';
import Button from './Button';
import {View} from 'react-native';
import Colors from '../constants/Colors';
import {WINDOW_WIDTH} from '../utils/ScreenLayout';
import NeumorphicButton from './NeumorphicButton';
import {Icon} from '@rneui/base';
import IconType from '../constants/IconType';

const CreateHeadingResponseModal = ({
  openModal,
  setOpenModal,
  onSubmit,
  initialData,
}) => {
  const handleSubmitSurveyType = values => {
    const body = {
      selectType: values?.selectType?.value,
      value:
        values?.selectType?.value === 'Heading'
          ? values.heading
          : values?.responseType?.value,
      options: values?.selectType?.value === 'Heading' ? [] : values?.options,
    };
    onSubmit(body);
  };

  const selectTypeOptions = [
    {value: 'Heading', label: 'Heading'},
    {value: 'Response', label: 'Response'},
  ];

  const responseTypeOptions = [
    {value: 'ShortTextArea', label: 'Short Text Area'},
    {value: 'textarea', label: 'Long Text Area'},
    {value: 'Select', label: 'Select'},
    {value: 'multiSelect', label: 'Multi-Select'},
    {value: 'Text', label: 'Text'},
    {value: 'Email', label: 'Email'},
    {value: 'Date', label: 'Date'},
    {value: 'time', label: 'Time'},
    {value: 'File', label: 'File'},
    {value: 'url', label: 'External Link'},
    {value: 'number', label: 'Phone Number'},
    {value: 'checkbox', label: 'Check-box'},
    {value: 'radio', label: 'Radio'},
  ];

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onDismiss={() => setOpenModal(false)}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: Colors().screenBackground},
            ]}>
            <Text>Create</Text>
            <View>
              <Formik
                initialValues={{
                  selectType: initialData?.selectType
                    ? {
                        value: initialData?.selectType,
                        label: initialData?.selectType,
                      }
                    : {value: 'Heading', label: 'Heading'},
                  heading:
                    initialData.selectType === 'Heading'
                      ? initialData?.value
                      : '',
                  responseType:
                    initialData.selectType !== 'Heading'
                      ? {value: initialData?.value, label: initialData?.value}
                      : null,
                  options:
                    initialData.options?.length > 0
                      ? initialData?.options
                      : [''],
                }}
                onSubmit={handleSubmitSurveyType}>
                {props => {
                  const handleSelectTypeChange = selectedOption => {
                    props.setFieldValue('selectType', selectedOption);
                    if (selectedOption.value === 'Heading') {
                      props.setFieldValue('heading', initialData?.value || '');
                      props.setFieldValue('responseType', null);
                    } else {
                      props.setFieldValue(
                        'responseType',
                        initialData?.value
                          ? {
                              value: initialData?.value,
                              label: initialData?.value,
                            }
                          : null,
                      );
                      props.setFieldValue('heading', '');
                    }
                  };

                  return (
                    <View style={{marginTop: 20}} onSubmit={props.handleSubmit}>
                      <View
                        className="mb-3"
                        controlId="exampleForm.ControlInput1">
                        <Text>Select</Text>
                        <NeumorphicDropDownList
                          className="w-100 text-primary"
                          name="selectType"
                          value={props?.values?.selectType}
                          data={selectTypeOptions}
                          onChange={handleSelectTypeChange}
                        />
                      </View>

                      {props?.values?.selectType?.value === 'Heading' ? (
                        <View>
                          <Text>Type Heading</Text>
                          <NeumorphicTextInput
                            placeholder="Enter Heading"
                            value={props?.values?.heading}
                            onChangeText={e => {
                              props.setFieldValue('heading', e);
                            }}
                          />
                        </View>
                      ) : (
                        <View>
                          <Text>Response Type</Text>
                          <NeumorphicDropDownList
                            name="responseType"
                            data={responseTypeOptions}
                            value={props?.values?.responseType}
                            onChange={selectedOption => {
                              props.setFieldValue(
                                'responseType',
                                selectedOption,
                              );
                            }}
                          />
                          {[
                            'Select',
                            'checkbox',
                            'radio',
                            'multiSelect',
                          ].includes(props?.values?.responseType?.value) && (
                            <View>
                              <Text className="mt-2">Type Options</Text>
                              <FieldArray
                                name="options"
                                render={arrayHelpers => (
                                  <View>
                                    <View>
                                      {props?.values?.options &&
                                      props?.values?.options?.length > 0
                                        ? props?.values?.options?.map(
                                            (item, index) => (
                                              <View
                                                key={index}
                                                style={{
                                                  display: 'flex',
                                                  flexDirection: 'row',
                                                }}>
                                                <NeumorphicTextInput
                                                  type="text"
                                                  placeholder="Enter options..."
                                                  name={`option.${index}`}
                                                  value={item}
                                                  onChangeText={e => {
                                                    props.setFieldValue(
                                                      `options.${index}`,
                                                      e,
                                                    );
                                                  }}
                                                />
                                                {props?.values?.options
                                                  ?.length > 1 && (
                                                  <Button
                                                    title={
                                                      <Icon
                                                        name="x-circle"
                                                        type={IconType.Feather}
                                                        size={25}
                                                        color={Colors().red}
                                                      />
                                                    }
                                                    onPress={() =>
                                                      arrayHelpers.remove(index)
                                                    }
                                                  />
                                                )}
                                                <Button
                                                  title={
                                                    <Icon
                                                      name="plus-circle"
                                                      type={IconType.Feather}
                                                      size={25}
                                                      color={Colors().aprroved}
                                                    />
                                                  }
                                                  onPress={() =>
                                                    arrayHelpers.insert(
                                                      index + 1,
                                                      '',
                                                    )
                                                  }
                                                />
                                              </View>
                                            ),
                                          )
                                        : null}
                                    </View>
                                  </View>
                                )}
                              />
                            </View>
                          )}
                        </View>
                      )}

                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            columnGap: 50,
                          }}>
                          <NeumorphicButton
                            title={'Close'}
                            titleColor={Colors().red}
                            btnRadius={10}
                            btnWidth={WINDOW_WIDTH * 0.3}
                            onPress={() => setOpenModal(false)}
                          />

                          <NeumorphicButton
                            title={'Save'}
                            titleColor={Colors().aprroved}
                            btnRadius={10}
                            btnWidth={WINDOW_WIDTH * 0.3}
                            onPress={() =>
                              handleSubmitSurveyType(props?.values)
                            }
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateHeadingResponseModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

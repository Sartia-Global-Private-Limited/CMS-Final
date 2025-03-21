import React, {useEffect, useState} from 'react';
import {FieldArray, Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, Text, ToastAndroid, View} from 'react-native';
import Button from '../../component/Button';
import {Icon} from '@rneui/base';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphicButton from '../../component/NeumorphicButton';
import CustomeHeader from '../../component/CustomeHeader';
import CreateHeadingResponseModal from '../../component/CreateHeadingResponseModal';
import {
  getAdminCreateSurvey,
  getAdminSingleSurvey,
  getAdminUpdateSurvey,
} from '../../services/authApi';
import Toast from 'react-native-toast-message';

const AddSurvey = ({route}) => {
  const id = route?.params?.id;
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigation();
  const [edit, setEdit] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [questionData, setQuestionsData] = useState([]);
  const [columns, setColumns] = useState([{key: 'column1', label: 'Column 1'}]);

  const fetchSingleSurveyData = async () => {
    const res = await getAdminSingleSurvey();
    if (res?.status) {
      setEdit(res?.data);
      setSurveySelected({value: res?.data.format, label: res?.data.format});
    } else {
      setEdit({});
    }
  };

  const handleSubmit = async values => {
    setLoading(true);
    const sData = {
      format: 'Add Item Table',
      title: values.title,
      description: values.description,
      questions: values?.questions,
    };
    if (edit.survey_id) {
      sData['id'] = edit?.survey_id;
    }
    try {
      const res = edit?.survey_id
        ? await getAdminUpdateSurvey(sData)
        : await getAdminCreateSurvey(sData);
      if (res.status) {
        setLoading(false);
        navigation.goBack();
        ToastAndroid.show(res?.message, ToastAndroid.LONG);
      } else {
        setLoading(false);
        ToastAndroid.show(res?.message, ToastAndroid.LONG);
      }
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(error?.message, ToastAndroid.LONG);
    }
  };

  const handleView = (rowIndex, colIndex) => {
    setCurrentEdit({rowIndex, colIndex});
    setOpenModal(true);
  };

  useEffect(() => {
    if (id !== 'new') {
      fetchSingleSurveyData();
    }
  }, [id]);

  const handleDefaultSelected = async (val, setFieldValue, name) => {
    if (setFieldValue) {
      setFieldValue(name, val);
    }
    if (!val) return false;
  };

  return (
    <SafeAreaView>
      <CustomeHeader headerTitle={'Create Survey'} />
      <View
        showBackButton={true}
        title={edit.survey_id ? 'Update Survey' : 'Create Survey'}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            format: edit?.format
              ? {value: edit?.format, label: edit?.format}
              : {value: 'Add General Field', label: 'Add General Field'},
            title: edit.title || '',
            description: edit.description || '',
            questions:
              questionData.length > 0
                ? questionData
                : [
                    {
                      columns: [
                        {key: '', selectType: '', value: '', options: ['']},
                      ],
                    },
                  ],
          }}
          onSubmit={handleSubmit}>
          {props => {
            const handleModalSubmit = data => {
              if (currentEdit) {
                const {rowIndex, colIndex} = currentEdit;
                const updatedQuestions = [...props.values.questions];
                if (!updatedQuestions[rowIndex]) {
                  updatedQuestions[rowIndex] = {columns: []};
                }
                if (!updatedQuestions[rowIndex].columns) {
                  updatedQuestions[rowIndex].columns = [];
                }
                if (!updatedQuestions[rowIndex].columns[colIndex]) {
                  updatedQuestions[rowIndex].columns[colIndex] = {
                    key: '',
                    value: '',
                  };
                }
                updatedQuestions[rowIndex].columns[colIndex] = {
                  key: columns[colIndex]?.key,
                  selectType: data?.selectType,
                  value: data.value,
                  options: data.options,
                };
                props.setFieldValue('questions', updatedQuestions);
                setQuestionsData(updatedQuestions);
              }
              setOpenModal(false);
            };
            return (
              <View onSubmit={props.handleSubmit}>
                <View>
                  <View md={12}>
                    <View>
                      <View style={{padding: 10, gap: 10}}>
                        <NeumorphicTextInput
                          placeholder="Enter Survey Title"
                          type="text"
                          name={'title'}
                          value={props.values.title}
                          width={WINDOW_WIDTH * 0.95}
                          onChangeText={e => {
                            props.setFieldValue('title', e);
                          }}
                        />
                        <NeumorphicTextInput
                          width={WINDOW_WIDTH * 0.95}
                          type="text"
                          name={'description'}
                          value={props.values.description}
                          onChangeText={e => {
                            props.setFieldValue('description', e);
                          }}
                          placeholder="Enter Description"
                        />
                      </View>
                      <FieldArray name="questions">
                        {({remove, push}) => {
                          const maxColumns = Math.max(
                            ...props.values.questions.map(
                              q => q.columns.length,
                            ),
                            columns.length,
                          );

                          return (
                            <View style={{padding: 10}}>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text style={{fontSize: 15, width: 50}}>
                                  Sr No.
                                </Text>
                                {Array.from(
                                  {length: maxColumns},
                                  (_, index) => (
                                    <Text
                                      key={index}
                                      style={{
                                        fontSize: 15,
                                        width: 300,
                                      }}>
                                      Column {index + 1}
                                    </Text>
                                  ),
                                )}
                                <View>
                                  <View align="left" title={'Add View'}>
                                    <Button
                                      btnStyle={{
                                        padding: 5,
                                      }}
                                      title={
                                        <Icon
                                          name="plus-circle"
                                          type={IconType.Feather}
                                          size={25}
                                          color={Colors().aprroved}
                                        />
                                      }
                                      onPress={() =>
                                        push({
                                          columns: Array.from(
                                            {length: maxColumns},
                                            (_, index) => ({
                                              key: `column${index + 1}`,
                                              selectType: '',
                                              value: '',
                                            }),
                                          ),
                                        })
                                      }
                                    />
                                  </View>
                                </View>
                              </View>

                              <View>
                                {props.values.questions.length > 0 &&
                                  props.values.questions.map(
                                    (data, rowIndex) => (
                                      <View
                                        key={rowIndex}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <Text>{rowIndex + 1}.</Text>
                                        {Array.from(
                                          {length: maxColumns},
                                          (_, colIndex) => (
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                                marginVertical: 5,
                                              }}>
                                              <View
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  flexDirection: 'row',
                                                }}>
                                                {data.columns[colIndex] ? (
                                                  <>
                                                    <NeumorphicTextInput
                                                      editable={false}
                                                      width={WINDOW_WIDTH * 0.7}
                                                      value={
                                                        data?.columns[colIndex]
                                                          ?.value || ''
                                                      }
                                                      onChangeText={e => {
                                                        const updatedQuestions =
                                                          [
                                                            ...props.values
                                                              .questions,
                                                          ];
                                                        updatedQuestions[
                                                          rowIndex
                                                        ].columns[
                                                          colIndex
                                                        ].value = e;
                                                        props.setFieldValue(
                                                          'questions',
                                                          updatedQuestions,
                                                        );
                                                        setQuestionsData(
                                                          updatedQuestions,
                                                        );
                                                      }}
                                                    />

                                                    <View title={'Edit'}>
                                                      <Button
                                                        btnStyle={{
                                                          padding: 5,
                                                        }}
                                                        title={
                                                          <Icon
                                                            name="edit"
                                                            type={
                                                              IconType.Feather
                                                            }
                                                            size={25}
                                                            color={
                                                              Colors().pending
                                                            }
                                                          />
                                                        }
                                                        onPress={() =>
                                                          handleView(
                                                            rowIndex,
                                                            colIndex,
                                                          )
                                                        }
                                                      />
                                                    </View>
                                                    {data?.columns?.length >
                                                      1 && (
                                                      <View
                                                        align="left"
                                                        title={'Remove Column'}>
                                                        <Button
                                                          btnStyle={{
                                                            padding: 2,
                                                          }}
                                                          onPress={() => {
                                                            const updatedQuestions =
                                                              [
                                                                ...props.values
                                                                  .questions,
                                                              ];
                                                            updatedQuestions[
                                                              rowIndex
                                                            ].columns.splice(
                                                              colIndex,
                                                              1,
                                                            );
                                                            props.setFieldValue(
                                                              'questions',
                                                              updatedQuestions,
                                                            );
                                                          }}
                                                        />
                                                      </View>
                                                    )}
                                                  </>
                                                ) : (
                                                  <View></View>
                                                )}
                                              </View>
                                            </View>
                                          ),
                                        )}

                                        <View
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                          }}>
                                          <View title={'Remove View'}>
                                            <Button
                                              btnStyle={{
                                                padding: 2,
                                              }}
                                              title={
                                                <Icon
                                                  name="x-circle"
                                                  type={IconType.Feather}
                                                  size={25}
                                                  color={Colors().red}
                                                />
                                              }
                                              onPress={() => remove(rowIndex)}
                                            />
                                          </View>
                                          {/* <View title={'Add Column'}>
                                            <Button
                                              btnStyle={{
                                                padding: 2,
                                              }}
                                              title={
                                                <Icon
                                                  name="plus-circle"
                                                  type={IconType.Feather}
                                                  size={25}
                                                  color={Colors().aprroved}
                                                />
                                              }
                                              onPress={() => {
                                                const updatedQuestions = [
                                                  ...props.values.questions,
                                                ];
                                                updatedQuestions[
                                                  rowIndex
                                                ].columns.push({
                                                  key: `new_column_${
                                                    updatedQuestions[rowIndex]
                                                      .columns.length + 1
                                                  }`,
                                                  selectType: '',
                                                  value: '',
                                                });
                                                props.setFieldValue(
                                                  'questions',
                                                  updatedQuestions,
                                                );
                                              }}
                                            />
                                          </View> */}
                                        </View>
                                      </View>
                                    ),
                                  )}
                              </View>
                            </View>
                          );
                        }}
                      </FieldArray>

                      <View style={{alignItems: 'center', marginTop: 20}}>
                        <NeumorphicButton
                          title={'Save Survey'}
                          loading={loading}
                          onPress={props.handleSubmit}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Modal for editing fields */}
                <CreateHeadingResponseModal
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  onSubmit={handleModalSubmit}
                  initialData={
                    props.values.questions[currentEdit?.rowIndex]?.columns[
                      currentEdit?.colIndex
                    ] || {}
                  }
                />
              </View>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default AddSurvey;

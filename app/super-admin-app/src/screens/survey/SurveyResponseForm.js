import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  getAdminSingleSurvey,
  postQuestionsSurvey,
} from '../../services/authApi';
import Colors from '../../constants/Colors';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {FieldArray, Formik} from 'formik';
import NeumorphicButton from '../../component/NeumorphicButton';
import CustomeHeader from '../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import MultiSelectComponent from '../../component/MultiSelectComponent';
import {CheckBox} from '@rneui/base';
import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import moment from 'moment';
import Loader from '../../component/Loader';

const SurveyResponseForm = ({route}) => {
  const id = route?.params?.id;
  const [openStartDate, setOpenStartDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    getSingleSurvey();
  }, [id]);

  const getSingleSurvey = async () => {
    setLoading(true);
    const response = await getAdminSingleSurvey(id);
    try {
      if (response?.status) {
        setResponseData(response?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setResponseData({});
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // const handleSubmit = async (values, {setSubmitting, resetForm}) => {
  //   const sData = {
  //     id: id,
  //   };
  //   if (otpData === false) {
  //     sData['mobile'] = values.mobile;
  //   }
  //   if (otpData === true) {
  //     sData['otp'] = otpArray?.join('');
  //   }
  //   return console.log('form-Data', sData);
  //   const res =
  //     otpData == false
  //       ? await postOtpSurvey(sData)
  //       : await postOtpVerifySurvey(sData);
  //   if (res.status) {
  //     toast.success(res.message);
  //     setOtpData(true);
  //     if (otpData == true) {
  //       setVerifyOtp(true);
  //     }
  //     if (otpData == true) {
  //       const response = await getAdminSingleSurvey(id);
  //       if (response.status) {
  //         setResponseData(response.data);
  //       } else {
  //         setResponseData({});
  //       }
  //     }
  //     // navigate("/AllSurvey");
  //   } else {
  //     toast.error(res.message);
  //   }
  //   resetForm();
  //   setSubmitting(false);
  // };

  const handleSubmit = async (values, {setSubmitting, resetForm}) => {
    const questionId = responseData?.questions?.map(itm => {
      return itm.columns || '';
    });

    const sData = {
      response: values.response,
      survey_id: responseData?.survey_id,
    };
    try {
      const res = await postQuestionsSurvey(sData);
      if (res.status) {
        ToastAndroid.show(res?.message, ToastAndroid.LONG);
        navigation.navigate('SurveyResponseDetailedView');
        resetForm();
        setSubmitting(false);
      } else {
        ToastAndroid.show(res?.message, ToastAndroid.LONG);
        resetForm();
        setSubmitting(false);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView>
      <CustomeHeader headerTitle={'Survey Response'} />
      <ScrollView>
        <View style={{marginBottom: 150}}>
          {loading ? (
            <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT}}>
              <Loader />
            </View>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={{
                response: responseData?.questions?.map((data, idx) => ({
                  columns: [
                    {
                      selectType: data?.columns[0]?.selectType,
                      value:
                        data?.columns[0]?.selectType == 'Response'
                          ? ''
                          : data.columns[0]?.value,
                    },
                  ],
                })),
              }}
              onSubmit={handleSubmit}>
              {props => (
                <View>
                  <Text
                    style={{
                      color: Colors().purple,
                      fontSize: 16,
                      paddingTop: 15,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    {responseData?.title}
                  </Text>
                  <Text
                    style={{
                      color: Colors().gray,
                      fontSize: 16,
                      paddingBottom: 10,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    {responseData?.description}
                  </Text>
                  <FieldArray name="response">
                    <View>
                      {props?.values?.response &&
                        props?.values?.response?.length > 0 &&
                        responseData &&
                        responseData?.questions?.length > 0 &&
                        responseData?.questions?.map((data, index) => {
                          const questionData = data.columns;

                          return (
                            <View
                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                margin: 10,
                              }}>
                              {questionData[0]?.selectType == 'Heading' ? (
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: Colors().pureBlack,
                                    textTransform: 'uppercase',
                                    fontFamily: Colors().fontFamilyBookMan,
                                  }}>
                                  {questionData[0]?.selectType == 'Heading'
                                    ? `Q. ${questionData[0]?.value}`
                                    : ''}
                                </Text>
                              ) : questionData[0]?.value == 'Select' ? (
                                <NeumorphicDropDownList
                                  width={WINDOW_WIDTH * 0.95}
                                  name={`response.${index}.columns[0].value`}
                                  value={
                                    props?.values?.response[index]?.columns[0]
                                      ?.value
                                  }
                                  data={questionData[0]?.options.map(ques => ({
                                    label: ques,
                                    value: ques,
                                  }))}
                                  onChange={val => {
                                    props.setFieldValue(
                                      `response.${index}.columns[0].value`,
                                      val.value,
                                    );
                                  }}
                                  onCancle={() => {
                                    props.setFieldValue(
                                      `response.${index}.columns[0].value`,
                                      '',
                                    );
                                  }}
                                />
                              ) : questionData[0]?.value == 'multiSelect' ? (
                                <View style={{}}>
                                  <MultiSelectComponent
                                    placeHolderTxt={'Options'}
                                    width={WINDOW_WIDTH * 0.9}
                                    height={WINDOW_HEIGHT * 0.1}
                                    data={questionData[0]?.options.map(
                                      ques => ({
                                        label: ques,
                                        value: ques,
                                      }),
                                    )}
                                    value={
                                      props?.values?.response[index]?.columns[0]
                                        ?.value
                                    }
                                    onChange={val => {
                                      props.setFieldValue(
                                        `response.${index}.columns[0].value`,
                                        val,
                                      );
                                    }}
                                  />
                                </View>
                              ) : questionData[0].value == 'radio' ? (
                                questionData[0]?.options?.map((option, idx) => (
                                  <CheckBox
                                    key={index}
                                    textStyle={{
                                      fontFamily: Colors().fontFamilyBookMan,
                                      color: Colors().gray,
                                      fontWeight: '500',
                                    }}
                                    containerStyle={{
                                      backgroundColor: Colors().cardBackground,
                                      padding: 0,
                                    }}
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o"
                                    title={option}
                                    //   disabled={edit_id ? true : false}
                                    checked={
                                      props?.values?.response[index]?.columns[0]
                                        ?.value == option
                                    }
                                    onPress={() => {
                                      props.setFieldValue(
                                        `response.${index}.columns[0].value`,
                                        option,
                                        console.log('value', option),
                                      );
                                    }}
                                    checkedColor={Colors().aprroved}
                                  />
                                ))
                              ) : questionData[0].value == 'checkbox' ? (
                                questionData[0]?.options?.map((option, idx) => (
                                  <View
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: 10,
                                      marginTop: 5,
                                    }}>
                                    <NeumorphicCheckbox
                                      isChecked={
                                        props?.values?.response[index]
                                          ?.columns[0]?.value[idx]
                                      }
                                      onChange={val => {
                                        props.setFieldValue(
                                          `response.${index}.columns[0].value.${idx}`,
                                          val,
                                        );
                                      }}
                                    />
                                    <Text
                                      style={[
                                        {
                                          color: Colors().purple,
                                          fontSize: 15,
                                          marginRight: 20,
                                        },
                                      ]}>
                                      {option}
                                    </Text>
                                  </View>
                                ))
                              ) : questionData[0].value == 'Date' ? (
                                <NeumorphDatePicker
                                  iconPress={() =>
                                    setOpenStartDate(!openStartDate)
                                  }
                                  width={WINDOW_WIDTH * 0.95}
                                  valueOfDate={
                                    props?.values?.response[index]?.columns[0]
                                      ?.value
                                      ? props?.values?.response[index]
                                          ?.columns[0]?.value
                                      : ''
                                  }
                                  modal
                                  open={openStartDate}
                                  date={new Date()}
                                  mode="date"
                                  onConfirm={date => {
                                    props.setFieldValue(
                                      `response.${index}.columns[0].value`,
                                      moment(date).format('DD/MM/YYYY'),
                                    );
                                    setOpenStartDate(false);
                                  }}
                                  onCancel={() => {
                                    setOpenStartDate(false);
                                  }}
                                />
                              ) : questionData[0].value == 'time' ? (
                                <NeumorphDatePicker
                                  iconPress={() =>
                                    setOpenStartDate(!openStartDate)
                                  }
                                  width={WINDOW_WIDTH * 0.95}
                                  valueOfDate={
                                    props?.values?.response[index]?.columns[0]
                                      ?.value
                                      ? props?.values?.response[index]
                                          ?.columns[0]?.value
                                      : 'hh:mm:a'
                                  }
                                  modal
                                  open={openStartDate}
                                  date={new Date()}
                                  mode="time"
                                  onConfirm={date => {
                                    props.setFieldValue(
                                      `response.${index}.columns[0].value`,
                                      moment(date).format('hh:mm:a'),
                                    );
                                    setOpenStartDate(false);
                                  }}
                                  onCancel={() => {
                                    setOpenStartDate(false);
                                  }}
                                />
                              ) : (
                                <NeumorphicTextInput
                                  width={WINDOW_WIDTH * 0.95}
                                  multiline={
                                    questionData[0].value == 'ShortTextArea' ||
                                    questionData[0].value == 'textarea'
                                      ? true
                                      : false
                                  }
                                  value={
                                    props?.values?.response[index]?.columns[0]
                                      ?.value
                                  }
                                  onChangeText={e => {
                                    props.setFieldValue(
                                      `response.${index}.columns[0].value`,
                                      e,
                                    );
                                  }}
                                />
                              )}
                            </View>
                          );
                        })}
                    </View>
                  </FieldArray>
                  <View
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <NeumorphicButton
                      title={'SUBMIT'}
                      loading={props?.isSubmitting}
                      onPress={() => props.handleSubmit()}
                    />
                  </View>
                </View>
              )}
            </Formik>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SurveyResponseForm;

const styles = StyleSheet.create({});

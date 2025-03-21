/*    ----------------Created Date :: 16- May -2024   ----------------- */
import {StyleSheet, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeCard from './CustomeCard';
import {useDispatch} from 'react-redux';
import {getAllManger} from '../redux/slices/commonApi';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import Toast from 'react-native-toast-message';
import {TextInput} from 'react-native';
import RatingCard from './RatingCard';

const InspectionFeedbackForm = ({formik, index: parentIndex}) => {
  const dispatch = useDispatch();

  const [ratings, setRatings] = useState([
    {
      subject:
        'IN YOUR OPINION HOW IS THE BEHAVIOR OF OUR TEAM AT YOUR OUTLET DURING WORK ?',
      rating: 0,
      id: 1,
    },
    {
      subject:
        'IN YOUR OPINION WHAT ABOUT THE WAY OF WORKING OF OUR TEAM AT YOUR OUTLET ?',
      rating: 0,
      id: 2,
    },
    {
      subject:
        'IN YOUR OPINION WHAT IS THE STANDARDS OF QUALITY OF THE MATERIALS USED AT YOUR OUTLET?',
      rating: 0,
      id: 3,
    },
    {
      subject:
        'IN YOUR OPINION HOW MUCH SAFETY CONCERN OUR TEAM DURING CARRYING OUT JOBS AT RETAIL OUTLET?',
      rating: 0,
      id: 4,
    },
    {
      subject:
        'IN YOUR OPINION OUR TEAM TIMELY REPORT TO THE OUTLET ON RECEIPT OF COMPLAINTS?',
      rating: 0,
      id: 5,
    },
    {
      subject:
        'IN YOUR OPINION HOW MUCH EFFECT COMES ON YOUR SALE DURING WORK EXICUTION AT YOUR OUTLET ?',
      rating: 0,
      id: 6,
    },
    {
      subject: 'HOW MUCH GRADE YOU WILL GIVE OVERALL OF OUR TEAM?',
      rating: 0,
      id: 7,
    },
  ]);

  const handleRatingChange = (newRating, index) => {
    // const updatedRatings = [...ratings];
    // updatedRatings[index] = newRating;
    // setRatings(updatedRatings);
    // Optionally, you can also pass data back to parent or update Formik here
    formik.setFro;
  };

  useEffect(() => {
    fetchManger();
  }, []);

  /*Function for getting manger data*/
  const fetchManger = async () => {
    const result = await dispatch(getAllManger()).unwrap();
    if (result?.status) {
      const rData = result?.data.map(item => ({
        label: item?.name,
        value: item?.id,
        image: item?.image,
      }));
      setManger(rData);
    } else {
      Toast.show({
        type: 'error',
        text1: result?.message,
        position: 'bottom',
      });
      setManger([]);
    }
  };

  return (
    <CustomeCard
      headerName={'Feedback form'}
      data={[
        {
          key: 'Person name',
          component: (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="TYPE..."
                placeholderTextColor={Colors().gray2}
                style={[
                  styles.inputText,
                  {
                    height: 20,
                    padding: 1,
                    paddingLeft: 5,
                    alignSelf: 'center',
                    color: Colors().pureBlack,
                    justifyContent: 'center',
                    flexShrink: 1,
                  },
                ]}
                value={
                  formik?.values?.feedback?.[parentIndex].contact_person_name
                }
                onChangeText={formik.handleChange(
                  `feedback.${parentIndex}.contact_person_name`,
                )}
              />
            </View>
          ),
        },
        {
          key: 'Contact person no',
          component: (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="TYPE..."
                placeholderTextColor={Colors().gray2}
                style={[
                  styles.inputText,
                  {
                    height: 20,
                    padding: 1,
                    paddingLeft: 5,
                    alignSelf: 'center',
                    color: Colors().pureBlack,
                    justifyContent: 'center',
                    flexShrink: 1,
                  },
                ]}
                keyboardType="numeric"
                maxLength={10}
                value={
                  formik?.values?.feedback?.[parentIndex].contact_person_no
                }
                onChangeText={formik.handleChange(
                  `feedback.${parentIndex}.contact_person_no`,
                )}
              />
            </View>
          ),
        },
        {
          key: 'email',
          component: (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="TYPE..."
                placeholderTextColor={Colors().gray2}
                style={[
                  styles.inputText,
                  {
                    height: 20,
                    padding: 1,
                    paddingLeft: 5,
                    alignSelf: 'center',
                    color: Colors().pureBlack,
                    justifyContent: 'center',
                    flexShrink: 1,
                  },
                ]}
                value={
                  formik?.values?.feedback?.[parentIndex].contact_person_email
                }
                onChangeText={formik.handleChange(
                  `feedback.${parentIndex}.contact_person_email`,
                )}
              />
            </View>
          ),
        },

        {
          component: (
            <View>
              <FlatList
                // data={feedbackQuestion}
                data={ratings}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item?.id?.toString()} // Assuming item.id is unique
                renderItem={({item, index}) => (
                  <RatingCard
                    key={item?.id?.toString()}
                    data={item}
                    index={index}
                    rating={ratings}
                    onRatingChange={newRating =>
                      handleRatingChange(newRating, index)
                    }
                  />
                )}
              />
            </View>
          ),
        },

        {
          key: 'if any complaint',
          component: (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="TYPE..."
                placeholderTextColor={Colors().gray2}
                style={[
                  styles.inputText,
                  {
                    height: 20,
                    padding: 1,
                    paddingLeft: 5,
                    alignSelf: 'center',
                    color: Colors().pureBlack,
                    justifyContent: 'center',
                    flexShrink: 1,
                  },
                ]}
                value={formik?.values?.feedback?.[parentIndex].complaints}
                onChangeText={formik.handleChange(
                  `feedback.${parentIndex}.complaints`,
                )}
              />
            </View>
          ),
        },
        {
          key: 'if any suggestion',
          component: (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="TYPE..."
                placeholderTextColor={Colors().gray2}
                style={[
                  styles.inputText,
                  {
                    height: 20,
                    padding: 1,
                    paddingLeft: 5,
                    alignSelf: 'center',
                    color: Colors().pureBlack,
                    justifyContent: 'center',
                    flexShrink: 1,
                  },
                ]}
                value={formik?.values?.feedback?.[parentIndex].suggestions}
                onChangeText={formik.handleChange(
                  `feedback.${parentIndex}.suggestions`,
                )}
              />
            </View>
          ),
        },
      ]}
    />
  );
};

export default InspectionFeedbackForm;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});

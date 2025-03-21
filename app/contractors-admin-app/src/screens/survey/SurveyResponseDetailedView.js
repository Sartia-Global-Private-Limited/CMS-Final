import {SafeAreaView, ScrollView, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import {getAllResponseSurvey} from '../../services/authApi';
import NeumorphicDropDownList from '../../component/DropDownList';
import {WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {View} from 'react-native';
import Colors from '../../constants/Colors';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';

const SurveyResponseDetailedView = () => {
  const [survey, setSurvey] = useState([]);
  const [surveyTable, setSurveyTable] = useState([]);
  const [surveyId, setSurveyId] = useState('');

  useEffect(() => {
    ResponseSurveyTable();
  }, []);

  const ResponseSurveyTable = async () => {
    const res = await getAllResponseSurvey();
    if (res.status) {
      setSurveyTable(res.data);
    } else {
      setSurveyTable([]);
    }
  };

  useEffect(() => {
    if (surveyTable?.length > 0) {
      setSurvey(surveyTable?.filter(itm => itm?.survey_id == surveyId));
    }
  }, [surveyId]);

  return (
    <SafeAreaView>
      <CustomeHeader headerTitle={'All Survey Response'} />
      <View style={{margin: 10}}>
        <Text
          style={{
            fontSize: 15,
            color: Colors().pureBlack,
            textTransform: 'uppercase',
            fontFamily: Colors().fontFamilyBookMan,
          }}>
          select to view response
        </Text>
        <NeumorphicDropDownList
          width={WINDOW_WIDTH * 0.95}
          value={surveyId}
          data={surveyTable?.map(ques => ({
            label: ques?.survey_name,
            value: ques?.survey_id,
          }))}
          onChange={val => {
            setSurveyId(val.value);
          }}
          onCancle={() => {
            setSurveyId('');
          }}
        />
      </View>
      <ScrollView>
        <View style={{marginBottom: 200}}>
          <Text
            style={{
              padding: 10,
              fontSize: 18,
              color: Colors().purple,
              textTransform: 'uppercase',
              fontFamily: Colors().fontFamilyBookMan,
            }}>
            {survey[0]?.survey_name}
          </Text>
          <View>
            {survey &&
              survey?.length > 0 &&
              survey?.map((item, index) => (
                <View>
                  {item?.response?.map((itm, idx) => {
                    const questionData = itm?.columns;
                    return (
                      <View style={{marginHorizontal: 10, marginVertical: 5}}>
                        {questionData[0]?.selectType == 'Heading' ? (
                          <Text
                            style={{
                              fontSize: 15,
                              color: Colors().pureBlack,
                              textTransform: 'uppercase',
                              fontFamily: Colors().fontFamilyBookMan,
                            }}>
                            Q. {questionData[0]?.value}
                          </Text>
                        ) : (
                          <NeumorphicTextInput
                            width={WINDOW_WIDTH * 0.95}
                            value={questionData[0]?.value}
                            editable={false}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SurveyResponseDetailedView;

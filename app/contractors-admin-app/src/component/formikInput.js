import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { useField } from 'formik';
import { Dropdown } from 'react-native-element-dropdown';
// import Button from './Button';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Colors from '../constants/Colors';
import { Neomorph } from 'react-native-neomorph-shadows';
// import Admin from '../asset/Icons/Admin.svg';
const Input = ({
  dropdownleftIcon,
  placeholder,
  label,
  formikProps,
  textarea,
  labelStyle,
  info,
  datepicker,
  select = {
    isSelect: false,
    labelField: 'label',
    valueField: 'value',
  },
  value,
  outerstyle,
  selectData,
  search = true,
  data = [],
  errorStyle,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={[style.layout]}>
        {props.type === 'Select' ? (
          <>
            {/* <Text style={style.label}>
              {label}
              {info?.required ? ' * ' : ''}
            </Text> */}
            <Neomorph
              inner
              darkShadowColor="#CED7E2" // <- set this
              lightShadowColor="#F5F9FD" // <- this
              style={{
                shadowOpacity: 1, // <- and this or yours opacity
                shadowRadius: 15,
                borderRadius: 5,
                backgroundColor: '#ECF0F3',
                // width: 300,
                // height: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                //  alignItems: 'center',
                // paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              <View style={[style.inputFeild, textarea]}>
                {props.leftIcon ? props.leftIcon : null}
                <Dropdown
                  disable={selectData.length === 0}
                  renderLeftIcon={() => dropdownleftIcon}
                  search={search}
                  maxSelect={3}
                  value={meta.admin}
                  data={selectData}
                  placeholder={`${placeholder}`}
                  style={[style.dropdown, props.dropdownstyle]}
                  containerStyle={{ backgroundColor: 'white' }}
                  labelField={select.labelField || 'label'}
                  valueField={select.valueField || 'value'}
                  placeholderStyle={[
                    style.placeholderStyle,
                    props.placeholdertextstyle,
                  ]}
                  selectedTextStyle={[
                    style.selectedTextStyle,
                    props.selecttextstyle,
                  ]}
                  dropdownPosition="auto"
                  inputSearchStyle={style.inputSearchStyle}
                  iconStyle={style.iconStyle}
                  iconSize={30}
                  itemTextStyle={{
                    backgroundColor: 'white',
                    color: '#000',
                  }}
                  maxHeight={300}
                  onChange={item => {
                    formikProps.setFieldValue(
                      props.name,
                      select.valueField ? item[select.valueField] : item.value,
                    );
                  }}
                  searchPlaceholder="Search..."
                  placeholderTextColor={[
                    Colors().Textplaceholder,
                    props.placeholdertextstyle,
                  ]}
                  itemContainerStyle={{
                    color: Colors().grey,
                    height: 55,
                    borderWidth: 1,
                    borderColor: Colors().grey,
                  }}
                  iconColor="#FFFFFF"
                />
                {props.rightIcon ? props.rightIcon : null}
              </View>
            </Neomorph>
          </>
        ) : label ? (
          <>
            {/* <Text style={[style.label, labelStyle]}>
              {label}
              {info?.required ? ' * ' : ''}
            </Text> */}
            <Neomorph
              inner
              darkShadowColor="#CED7E2" // <- set this
              lightShadowColor="#F5F9FD" // <- this
              style={{
                shadowOpacity: 1, // <- and this or yours opacity
                shadowRadius: 15,
                borderRadius: 5,
                backgroundColor: '#ECF0F3',
                // width: width ? width : 300,
                // height: height ? height : 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                //  alignItems: 'center',
                // paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              {props.leftIcon ? props.leftIcon : null}
              {!datepicker ? (
                <TextInput
                  style={[style.placeholder, textarea]}
                  onChangeText={formikProps.handleChange(field.name)}
                  placeholder={placeholder}
                  placeholderTextColor={Colors().Textplaceholder}
                  autoCorrect={false}
                  value={meta.value}
                  {...props.inputProps}></TextInput>
              ) : (
                <>
                  <Button
                    title={`${meta?.value ? meta.value : 'Choose Date'}`}
                    type="simple"
                    btnStyle={style.datepicker}
                    textstyle={style.textstyle}
                    onPress={() => setOpen(true)}
                  />
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="date"
                    value={date}
                    onConfirm={date => {
                      setOpen(false);
                      setDate(date);
                      formikProps.setFieldValue(
                        field.name,
                        moment(date).format('YYYY/MM/DD'),
                      );
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </>
              )}
              {props.rightIcon ? props.rightIcon : null}
            </Neomorph>
          </>
        ) : null}
      </View>
    </>
  );
};
export default Input;
const style = StyleSheet.create({
  layout: {
    marginTop: 10,
    height: 'auto',
  },
  label: {
    width: 'auto',
    height: 30,
    left: 16,
    fontFamily: 'Poppins',
    fontSize: 18,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    color: '"black',
  },
  inputFeild: {
    width: '91%',
    left: 16,
    display: 'flex',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'justify',
    borderRadius: 5,
    // backgroundColor: 'tra',
    // borderWidth: 0.8,
    // borderColor: '#AAAAAA',
  },
  placeholder: {
    width: '85%',
    fontFamily: 'Poppins',
    flex: 1,
    height: 45,
    fontSize: 18,
    textAlign: 'left',
    color: '"black',
  },
  dropdown: {
    width: '100%',
    alignSelf: 'left',
    height: 'auto',
    backgroundColor: 'transparent',
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#000',
    borderRadius: 30,
  },
  textstyle: {
    fontFamily: 'Poppins-light.ttf',
    color: Colors().black2faf,
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingHorizontal: 5,
    color: Colors().gray,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 5,
  },
  iconStyle: {
    width: 30,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    color: '#000',
    fontSize: 16,
  },
  datepicker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

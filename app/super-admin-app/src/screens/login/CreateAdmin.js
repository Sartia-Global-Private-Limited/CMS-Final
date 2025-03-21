import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import React, {useState} from 'react';
import logo from '../../asset/Vector.png';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import {Colors, Layout} from '../../utlis/Constants';
import AppHeader from '../../Components/AppHeader';
import {Formik} from 'formik';
import Admin from '../../asset/Icons/admincreate.svg';
import Email from '../../asset/Icons/email.svg';
import Phone from '../../asset/Icons/phone.svg';
import eventicon from '../../asset/eventicon.png';
import {commoncss} from '../../Components/Common';

const CreateAdmin = () => {
  const [eventlist, seteventlist] = useState([
    {event: 'poker', id: 1},
    {event: 'Football', id: 2},
    {event: 'Chess', id: 3},
    {event: 'Cricket', id: 4},
    {event: 'Carrom', id: 5},
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View style={styles.Inputs}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            //validationSchema={loginSchema}
            //   onSubmit={handleSubmit}
          >
            {props => (
              <>
                <Input
                  placeholder={'Admin Name'}
                  label={'Name'}
                  name={'name'}
                  leftIcon={
                    <Button
                      type={'simple'}
                      title={<Admin />}
                      btnStyle={styles.imageiconbtn}
                    />
                  }
                  formikProps={props}
                  info={{
                    required: true,
                  }}
                  inputProps={{
                    autoCapitalize: 'none',
                  }}
                />
                <Input
                  placeholder={'felicia.reid@example.com'}
                  label={'Email'}
                  name={'email'}
                  formikProps={props}
                  info={{
                    required: true,
                  }}
                  inputProps={{
                    autoCapitalize: 'none',
                  }}
                  containerStyle={{marginTop: 20}}
                  leftIcon={
                    <Button
                      type={'simple'}
                      title={<Email />}
                      btnStyle={styles.imageiconbtn}
                    />
                  }
                />
                <Input
                  placeholder={'(+33)7 75 55 65 33'}
                  label={'Contact'}
                  name={'contact'}
                  formikProps={props}
                  info={{
                    required: true,
                  }}
                  inputProps={{
                    autoCapitalize: 'none',
                  }}
                  containerStyle={{marginTop: 20}}
                  leftIcon={
                    <Button
                      type={'simple'}
                      title={<Phone />}
                      btnStyle={styles.imageiconbtn}
                    />
                  }
                />
                <Input
                  placeholder={'Event'}
                  label={'Assign Event'}
                  name={'event'}
                  type="Select"
                  leftIcon={
                    <Button
                      title={
                        <ImageBackground
                          resizeMode="cover"
                          source={eventicon}
                          style={styles.imageicon}
                        />
                      }
                      type="simple"
                      btnStyle={styles.imageiconbtn}
                    />
                  }
                  formikProps={props}
                  info={{
                    required: true,
                  }}
                  inputProps={{
                    autoCapitalize: 'none',
                  }}
                  select={{
                    isSelect: true,
                    labelField: 'event',
                    valueField: 'id',
                  }}
                  selectData={eventlist}
                  textarea={{height: 50}}
                  containerStyle={{marginTop: 20}}
                />
                <Input
                  placeholder={'text........'}
                  label={'Description'}
                  name={'description'}
                  formikProps={props}
                  textarea={styles.textAreaStyle}
                  info={{
                    required: true,
                  }}
                  inputProps={{
                    autoCapitalize: 'none',
                    multiline: true,
                    textAlignVertical: 'top',
                  }}
                  textArea={styles.textAreaStyle}
                  containerStyle={{marginTop: 20}}
                />

                <Button
                  title={'Create'}
                  btnStyle={commoncss.bigbtn}
                  type={'linear'}
                  border={commoncss.linearborder}
                  textstyle={commoncss.textstyle}
                  onPress={props.handleSubmit}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAdmin;

const styles = StyleSheet.create({
  container: {
    width: Layout.width,
    height: Layout.height,
  },
  image: {
    flex: 1,
  },
  imageicon: {
    resizeMode: 'center',
    width: 30,
    height: 30,
  },
  imageiconbtn: {
    padding: 10,
  },
  Inputs: {
    display: 'flex',
    flex: 1 / 3,
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  main_box: {
    height: 150,
    width: Layout.width,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  logo: {
    width: 88,
    height: 77,
  },
  textAreaStyle: {
    height: 120,
    width: Layout.width - 30,
  },
  Inputs: {
    display: 'flex',
    flex: 1,
    marginBottom: 50,
  },
});

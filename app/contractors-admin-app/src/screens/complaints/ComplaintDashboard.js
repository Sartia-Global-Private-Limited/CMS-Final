import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import NeumorphLinearGradientCard from '../../component/NeumorphLinearGradientCard';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import SeparatorComponent from '../../component/SeparatorComponent';
import {WINDOW_HEIGHT} from '../../utils/ScreenLayout';

const ComplaintDashboard = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'DASHBOARD'} />
      <View style={styles.cardContainer}>
        <View>
          <TouchableOpacity onPress={() => Alert.alert('card pressed')}>
            <NeumorphLinearGradientCard
              itemData={'TOTAL COMPLAINTS COUNT'}
              gradientArray={Colors().skyGradient}
            />
          </TouchableOpacity>
          <SeparatorComponent
            separatorColor={Colors().screenBackground}
            separatorWidth={WINDOW_HEIGHT * 0.01}
          />
          <TouchableOpacity onPress={() => Alert.alert('card pressed')}>
            <NeumorphLinearGradientCard
              itemData={'TOTAL COMPLAINTS COUNT'}
              gradientArray={Colors().orangeGradient}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('CompalintTypeDashboard')}>
            <NeumorphLinearGradientCard
              itemData={'TOTAL COMPLAINTS TYPES'}
              gradientArray={Colors().redGradient}
            />
          </TouchableOpacity>
          <SeparatorComponent
            separatorColor={Colors().screenBackground}
            separatorWidth={WINDOW_HEIGHT * 0.01}
          />
          <TouchableOpacity onPress={() => Alert.alert('card pressed')}>
            <NeumorphLinearGradientCard
              itemData={'TOTAL COMPLAINTS COUNT'}
              gradientArray={Colors().purpleGradient}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComplaintDashboard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: WINDOW_HEIGHT * 0.04,
    marginHorizontal: WINDOW_HEIGHT * 0.03,
    justifyContent: 'space-between',
  },
});

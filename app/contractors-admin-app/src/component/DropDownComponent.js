import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import {Neomorph} from 'react-native-neomorph-shadows';

const Dropdown = ({label, options, onSelect}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = value => {
    setSelectedValue(value);
    setModalVisible(false);
    onSelect(value);
  };

  return (
    <View style={{margin: 10}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <Neomorph
        inner // <- enable shadow inside of neomorph
        swapShadows // <- change zIndex of each shadow color
        style={{
          shadowRadius: 10,
          borderRadius: 25,
          backgroundColor: '#DDDDDD',
          width: 150,
          height: 150,
        }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>{selectedValue ? selectedValue : 'Select...'}</Text>
        </TouchableOpacity>
      </Neomorph>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
            }}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{paddingVertical: 10, paddingHorizontal: 20}}
                  onPress={() => handleSelect(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const DropDownComponent = () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleSelect = value => {};

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Dropdown
        label="COMPANY NAME"
        options={options}
        onSelect={handleSelect}
      />
      <Dropdown label="OUTLET AREA" options={options} onSelect={handleSelect} />
      <Dropdown
        label="REGIONAL OFFICE"
        options={options}
        onSelect={handleSelect}
      />
      <Dropdown label="SALES AREA" options={options} onSelect={handleSelect} />
    </View>
  );
};

export default DropDownComponent;

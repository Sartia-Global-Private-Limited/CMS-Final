import { StyleSheet, LogBox } from 'react-native';
import React, { useEffect } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { SocketContext, socket } from './src/context/socket';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const App = () => {
  useEffect(() => {
    socket.on('connect', () => {});
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContext.Provider value={socket}>
          <MainNavigator />
        </SocketContext.Provider>
      </PersistGate>
      <Toast />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});

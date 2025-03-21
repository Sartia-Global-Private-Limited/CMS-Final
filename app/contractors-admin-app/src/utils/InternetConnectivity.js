/*    ----------------Created Date :: 29- April -2024   ----------------- */

import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {AppState} from 'react-native';

const InternetConnectivity = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMounted, setIsMounted] = useState(true);
  const [isConnected, setIsConnected] = useState(null);

  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      setIsMounted(true);
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      setIsMounted(false);
    }
    setAppState(nextAppState);
  };

  //Listener for App state change
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  //Listener for netwoek connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [AppState.currentState]);

  return isConnected;
};

export default InternetConnectivity;

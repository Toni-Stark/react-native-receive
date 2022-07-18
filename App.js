import React, {useEffect, useMemo} from 'react';
import {StatusBar, useWindowDimensions, BackHandler, Alert} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ShareHomepage} from './src/pages/ShareHomepage';

const App = () => {
  const window = useWindowDimensions();
  const equipmentType = useMemo(() => {
    let proportion = window.width / window.height;
    return proportion > 1;
  }, [window.height, window.width]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onBackPress = () => {
    Alert.alert(
      '退出应用',
      '确认退出应用吗?',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: '确认', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
    );
    return true;
  };

  return (
    <>
      <StatusBar barStyle={equipmentType ? 'light-content' : 'dark-content'} />
      <ShareHomepage equipmentType={equipmentType} />
    </>
  );
};

export default App;

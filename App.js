import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  Dimensions,
  StatusBar,
  useWindowDimensions,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
  TouchableOpacity,
  Text,
  View,
  Button,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import WebView from 'react-native-webview';
import FastImage from 'react-native-fast-image';

import {RegSharePath} from './src/common/toos';

const App: () => React$Node = () => {
  const window = useWindowDimensions();
  const screenHeight = Dimensions.get('screen');
  const [shareFile, setShareFile] = useState(undefined);
  const [current, setCurrent] = useState(0);

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
  useEffect(() => {
    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
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

  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(
      (files) => {
        let data = getShareUrl(files);
        setShareFile(data);
      },
      (error) => {
        console.log(error, '[ERROR]');
      },
      'ShareMedia',
    );
  }, []);

  const getShareUrl = (request) => {
    return request;
  };

  const equipmentType = useMemo(() => {
    let proportion = window.width / window.height;
    return proportion > 1;
  }, [window.height, window.width]);

  const useSourceOrView = useMemo(() => {
    let source = shareFile?.length > current ? shareFile[current] : {};
    if (source?.fileName) {
      return (
        <View>
          <FastImage
            style={{width: 300, height: 200}}
            source={{
              uri: 'https://img2.baidu.com/it/u=3405685473,1965643872&fm=253&fmt=auto&app=138&f=JPEG?w=1130&h=500',
            }}
          />
        </View>
      );
    } else {
      let options = {
        uri: source.text ? RegSharePath(source.text) : source.weblink,
      };
      console.log(options);
      if (options.uri) {
        return (
          <WebView
            source={options}
            onLoad={() => {}}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000E2E',
            }}
          />
        );
      } else {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 32, color: '#070d33'}}>ReactNative</Text>
          </TouchableOpacity>
        );
      }
    }
  }, [current, shareFile]);

  const renderContent = useMemo(() => {
    return (
      <KeyboardAvoidingView behavior="position">
        <SafeAreaView
          style={{
            width: window.width,
            height: screenHeight.height,
            paddingTop: equipmentType ? 0 : 35,
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <View style={{width: '100%', height: '50%'}}>
            <View
              style={{
                padding: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                }}>
                举报信息填写
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderStyle: 'solid',
                borderColor: '#f2f2f2',
                borderWidth: 1,
                marginLeft: 10,
                marginRight: 10,
              }}>
              {useSourceOrView}
            </View>
          </View>

          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                marginTop: 30,
                padding: 10,
                width: '80%',
                backgroundColor: '#14a2a2',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                }}>
                提交
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }, [equipmentType, screenHeight.height, useSourceOrView, window.width]);

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle={equipmentType ? 'dark-content' : 'light-content'}
        backgroundColor="rgba(0, 0, 0, 0)"
      />
      {renderContent}
    </>
  );
};

export default App;

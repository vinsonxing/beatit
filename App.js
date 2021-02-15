/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
// import {NativeModules} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Home from './js/home';
import AllSchoolList from './js/school/all';
import ManageSchool from './js/school/manageSchool';
import CommunityList from './js/community';
import HouseList from './js/house';
import HouseDetail from './js/house/detail';
import SearchList from './js/community/searchList';
import TagSchool from './js/home/tagSchool';
// import houses from './mock/house.json';

// const {HtmlParser, GitHubBase64Decoder} = NativeModules;

const Stack = createStackNavigator();
function App() {
  useEffect(() => {
    const aa = async () => {
      // console.log(HtmlParser);
      console.log('start parsing');
      // const content =
      //   '';
      // const oo = await GitHubBase64Decoder.parse(content);
      // console.log(oo);
      // const url = 'https://sh.lianjia.com/ershoufang/107103448110.html';
      // const res = await HtmlParser.parse(url, [
      //   {
      //     field: 'housePic',
      //     selector: '.m-content .housePic .list img',
      //     type: 'String',
      //     attribute: 'src',
      //   },
      // ]);
      // const url = `https://sh.lianjia.com/ershoufang/rs${encodeURI(
      //   '盛世年华',
      // )}`;
      // const res = await HtmlParser.parse(url, [
      //   {
      //     field: 'title',
      //     selector: '.sellListContent.LOGCLICKDATA li .title a',
      //     type: 'String',
      //   },
      //   {
      //     field: 'img',
      //     selector: '.sellListContent.LOGCLICKDATA li a.img img.lj-lazy',
      //     type: 'String',
      //     attribute: 'data-original',
      //   },
      //   {
      //     field: 'detailLink',
      //     selector: '.sellListContent.LOGCLICKDATA li .title a',
      //     type: 'String',
      //     attribute: 'href',
      //   },
      //   {
      //     field: 'positionInfo',
      //     selector: '.sellListContent.LOGCLICKDATA li .positionInfo a',
      //     type: 'String',
      //   },
      //   {
      //     field: 'houseInfo',
      //     selector: '.sellListContent.LOGCLICKDATA li .houseInfo',
      //     type: 'String',
      //   },
      //   {
      //     field: 'followInfo',
      //     selector: '.sellListContent.LOGCLICKDATA li .followInfo',
      //     type: 'String',
      //   },
      //   {
      //     field: 'priceInfo',
      //     selector: '.sellListContent.LOGCLICKDATA li .priceInfo .totalPrice',
      //     type: 'String',
      //   },
      //   {
      //     field: 'unitPrice',
      //     selector: '.sellListContent.LOGCLICKDATA li .priceInfo .unitPrice',
      //     type: 'String',
      //   },
      //   {
      //     field: 'tag',
      //     selector: '.sellListContent.LOGCLICKDATA li .tag',
      //     type: 'StringOfArray',
      //     moreSelector: 'span',
      //     separator: ' ',
      //   },
      // ]);
      // console.log(res);
      console.log('end parsing');
    };
    aa();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={({navigation}) => ({
              headerTitle: '感兴趣的',
            })}
          />
          <Stack.Screen
            name="AllSchoolList"
            component={AllSchoolList}
            options={{title: '所有学校'}}
          />
          <Stack.Screen
            name="ManageSchool"
            component={ManageSchool}
            options={{title: '添加学校'}}
          />
          <Stack.Screen
            name="CommunityList"
            component={CommunityList}
            options={({route}) => ({
              headerTitle: route.params?.title,
            })}
          />
          <Stack.Screen
            name="HouseList"
            component={HouseList}
            options={({route}) => ({
              headerTitle: route.params?.title,
            })}
          />
          <Stack.Screen
            name="HouseDetail"
            component={HouseDetail}
            options={({route}) => ({
              headerTitle: '房屋详情',
            })}
          />
          <Stack.Screen
            name="SearchList"
            component={SearchList}
            options={({route}) => ({
              headerTitle: '小区列表',
            })}
          />
          <Stack.Screen
            name="TagSchool"
            component={TagSchool}
            options={({route}) => ({
              headerTitle: '小区列表',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

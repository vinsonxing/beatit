import React, {useState, useLayoutEffect, useRef} from 'react';
import {Alert, ActivityIndicator, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import {ButtonGroup, Icon, Button} from 'react-native-elements';
import InterestedSchools from './interestedSchools';
import InterestedCommunities from './interestedCommunities';
import STYLES from '../../styles';
import useDao from '../hooks/useDao';
import useApi from '../hooks/useApi';

const EDIT_MODE = '完成';
const VIEW_MODE = '管理';
export const Home = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [
    isGeneratingInterestedCommunities,
    setIsGeneratingInterestedCommunities,
  ] = useState(false);
  const {navigation} = props;
  const [curIndex, setCurIndex] = useState(0);
  const {
    state: daoState,
    addInterestedCommunities,
    addInterestedSchools,
    getInterestedSchools,
  } = useDao();
  const {
    state: apiState,
    getInterestedCommunityList,
    getInterestedSchoolList,
  } = useApi();

  const buttons = ['小区', '学校'];

  const setMode = (isEditMode) => {
    setEditMode(isEditMode);
    navigation.setParams({editMode: isEditMode});
  };

  const getLeftBtn = () => (
    <Button
      containerStyle={{left: 10}}
      onPress={() => {
        setMode(!editMode);
      }}
      title={editMode ? EDIT_MODE : VIEW_MODE}
      type="clear"
    />
  );

  const getRightBtn = (isSearch) => {
    const btnSetting = isSearch
      ? {
          icon: <Icon name="search" type="evilIcons" />,
        }
      : {title: '添加'};
    return (
      <Button
        {...btnSetting}
        containerStyle={{right: 10}}
        onPress={() => {
          editMode && setMode(navigation, false);
          if (isSearch) {
            // go to community search
            navigation.navigate('SearchList');
          } else {
            navigation.navigate('AllSchoolList');
          }
        }}
        type="clear"
      />
    );
  };
  const showDeleteAllAlert = () =>
    Alert.alert(
      '删除所有',
      `确定要删除当前[${curIndex === 0 ? '小区' : '学校'}]列表么吗?`,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            if (curIndex === 0) {
              await addInterestedCommunities([]);
            } else if (curIndex === 1) {
              await addInterestedSchools([]);
            }
          },
        },
      ],
      {cancelable: false},
    );

  const getRightButtonForEdit = () => {
    return (
      <Button
        title="删除所有"
        containerStyle={{right: 10}}
        onPress={showDeleteAllAlert}
        type="clear"
      />
    );
  };

  const getNavOptions = (idx) => ({
    headerLeft: () => getLeftBtn(),
    headerRight: () =>
      editMode ? getRightButtonForEdit() : getRightBtn(idx === 0),
  });

  const showLoadAlert = () =>
    Alert.alert(
      '下载',
      `确定要替换当前[${curIndex === 0 ? '小区' : '学校'}]列表么吗?`,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            await loadData();
          },
        },
      ],
      {cancelable: false},
    );

  const loadData = async () => {
    if (curIndex === 0) {
      const comms = await getInterestedCommunityList();
      await addInterestedCommunities(comms);
    } else if (curIndex === 1) {
      const schs = await getInterestedSchoolList();
      await addInterestedSchools(schs);
    }
    setMode(!editMode);
  };

  useLayoutEffect(() => {
    navigation.setOptions(getNavOptions(curIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, curIndex]);

  const showLoading = () =>
    apiState.isFetchingInterestedCommunityList ||
    apiState.isFetchingInterestedSchoolList ||
    daoState.isSavingData ||
    isGeneratingInterestedCommunities;

  const copyToClipboard = async () => {
    if (curIndex === 0) {
      const comms = await getInterestedCommunityList();
      await Clipboard.setString(JSON.stringify(comms));
    } else if (curIndex === 1) {
      const schs = await getInterestedSchoolList();
      await Clipboard.setString(JSON.stringify(schs));
    }
    setMode(!editMode);
  };

  const generateInterestedCommunities = async () => {
    // load communities by schools
    setIsGeneratingInterestedCommunities(true);
    const newSchs = await getInterestedSchools();
    if (!newSchs) {
      Alert.alert('请先选择感兴趣的学校');
      setIsGeneratingInterestedCommunities(false);
      return;
    }
    if (!Array.isArray(newSchs) || newSchs.length === 0) {
      Alert.alert('请先选择感兴趣的学校');
      setIsGeneratingInterestedCommunities(false);
      return;
    }
    // let schs = JSON.parse(schsStr);
    // const newSchs = [];
    // for (let i = 0; i < schs.length; i++) {
    //   let communities = [];
    //   if (
    //     !Array.isArray(schs[i].communities) ||
    //     schs[i].communities.length === 0
    //   ) {
    //     communities = await getCommunityList({
    //       schoolCode: schs[i].id,
    //       level: schs[i].junior ? 396 : 397,
    //     });
    //   }
    //   schs[i].communities = communities;
    //   newSchs.push(schs[i]);
    //   setPopulatedPercent(Math.floor((i / (schs.length - 1)) * 100));
    // }
    // console.log(JSON.stringify(newSchs));
    // await addInterestedSchools(newSchs);

    // to be optimized
    const junior = newSchs.filter((s) => s.junior);
    let juniorCommunities = [];
    junior.forEach((j) => {
      const jc = {jLevel: j.level, jSchool: j.name};
      const jcc = j.communities.map((jjc) => ({
        ...jc,
        roadarea: jjc.roadarea,
        vill: jjc.vill,
      }));
      juniorCommunities = juniorCommunities.concat(jcc);
    });
    const primary = newSchs.filter((s) => !s.junior);
    let primaryCommunities = [];
    primary.forEach((p) => {
      const pc = {level: p.level, school: p.name};
      const pcc = p.communities.map((ppc) => ({
        ...pc,
        roadarea: ppc.roadarea,
        vill: ppc.vill,
      }));
      primaryCommunities = primaryCommunities.concat(pcc);
    });

    const interestedCommunities = [];
    juniorCommunities.forEach((jc) => {
      if (!jc.vill) {
        return;
      }
      const pc = primaryCommunities.find(
        (ppc) =>
          ppc.vill &&
          (ppc.vill === jc.vill ||
            ppc.vill.includes(jc.vill) ||
            jc.vill.includes(ppc.vill) ||
            jc.roadarea == ppc.roadarea),
      );
      if (pc) {
        interestedCommunities.push({
          ...jc,
          ...pc,
        });
      }
    });
    const uniqueIC = [];
    interestedCommunities.forEach((ic) => {
      if (uniqueIC.find((uic) => uic.vill === ic.vill)) {
        return;
      }
      uniqueIC.push(ic);
    });
    await addInterestedCommunities(uniqueIC);
    setIsGeneratingInterestedCommunities(false);
  };

  // school
  // {
  //   "id": 3839,
  //   "name": "二中心小学[巨野校区]",
  //   "addr": "南洋泾路280弄",
  //   "junior": false,
  //   "duo": true,
  //   "level": 2
  //   "communities": []
  // },

  //   aid: "0"
  // id: "3987"
  // other: ""
  // pid: "3991"
  // roadarea: "繁锦路1288弄"
  // school: "六师附小[芳菲校区]"
  // strarea: "高行镇"
  // vill: "新城碧翠"

  // jLevel: 3
  // jSchool: "进才北校"
  // level: 1
  // roadarea: "(大湖王朝) 源深 浦东"
  // school: "福山外国语"
  // vill: "盛世年华"

  return (
    <SafeAreaView edges="bottom" style={STYLES.Styles.FlexOne}>
      {showLoading() && (
        <View style={[STYLES.Styles.LoadingStyle, STYLES.Styles.Center]}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <ButtonGroup
        onPress={setCurIndex}
        selectedIndex={curIndex}
        buttons={buttons}
      />
      {!showLoading() && curIndex === 0 && <InterestedCommunities {...props} />}
      {!showLoading() && curIndex === 1 && <InterestedSchools {...props} />}
      {!showLoading() && editMode && (
        <View>
          <Button
            onPress={generateInterestedCommunities}
            titleStyle={localStyle.titleStyle}
            icon={
              <Icon
                style={localStyle.iconStyle}
                name="color-fill"
                size={20}
                color="white"
                type="ionicon"
              />
            }
            title={'生成双学区小区并加入感兴趣小区列表'}
          />
          <View style={localStyle.btnSeparator} />
          <Button
            onPress={showLoadAlert}
            titleStyle={localStyle.titleStyle}
            icon={
              <Icon
                style={localStyle.iconStyle}
                name="sync"
                size={20}
                color="white"
                type="antdesign"
              />
            }
            title={`下载感兴趣的${curIndex === 0 ? '小区' : '学校'}`}
          />
          <View style={localStyle.btnSeparator} />
          <Button
            onPress={copyToClipboard}
            titleStyle={localStyle.titleStyle}
            icon={
              <Icon
                style={localStyle.iconStyle}
                name="copy1"
                size={20}
                color="white"
                type="antdesign"
              />
            }
            title={`Copy${curIndex === 0 ? '小区' : '学校'}列表到剪切板`}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const localStyle = {
  titleStyle: {paddingVertical: 10},
  iconStyle: {marginRight: 10},
  btnSeparator: {paddingVertical: 3},
};

export default Home;

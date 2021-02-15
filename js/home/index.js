import React, {useState, useLayoutEffect} from 'react';
import {Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
  const {navigation} = props;
  const [curIndex, setCurIndex] = useState(0);
  const {addInterestedCommunities, addInterestedSchools} = useDao();
  const {getInterestedCommunityList, getInterestedSchoolList} = useApi();

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

  const getNavOptions = (idx) => ({
    headerLeft: () => getLeftBtn(),
    headerRight: () => getRightBtn(idx === 0),
  });

  const showAlert = (community) =>
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
  };

  useLayoutEffect(() => {
    navigation.setOptions(getNavOptions(curIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, curIndex]);

  return (
    <SafeAreaView edges="bottom" style={STYLES.Styles.FlexOne}>
      <ButtonGroup
        onPress={setCurIndex}
        selectedIndex={curIndex}
        buttons={buttons}
      />
      {curIndex === 0 && <InterestedCommunities {...props} />}
      {curIndex === 1 && <InterestedSchools {...props} />}
      {editMode && (
        <Button
          onPress={showAlert}
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
      )}
    </SafeAreaView>
  );
};

const localStyle = {
  titleStyle: {paddingVertical: 10},
  iconStyle: {marginRight: 10},
};

export default Home;

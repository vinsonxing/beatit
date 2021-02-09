import React, {useState, useLayoutEffect} from 'react';
import {View} from 'react-native';
import {ButtonGroup, Icon, Button} from 'react-native-elements';
import InterestedSchools from './interestedSchools';
import InterestedCommunities from './interestedCommunities';
import STYLES from '../../styles';

const EDIT_MODE = '完成';
const VIEW_MODE = '管理';
export const Home = (props) => {
  const [editMode, setEditMode] = useState(false);
  const {navigation} = props;
  const [curIndex, setCurIndex] = useState(0);

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

  useLayoutEffect(() => {
    navigation.setOptions(getNavOptions(curIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, curIndex]);

  return (
    <View style={STYLES.Styles.FlexOne}>
      <ButtonGroup
        onPress={setCurIndex}
        selectedIndex={curIndex}
        buttons={buttons}
      />
      {curIndex === 0 && <InterestedCommunities {...props} />}
      {curIndex === 1 && <InterestedSchools {...props} />}
    </View>
  );
};

export default Home;

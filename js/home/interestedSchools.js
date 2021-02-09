import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {ListItem, Avatar, Icon, Badge} from 'react-native-elements';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';

const JUNIOR_AVATAR_URI = require('../../images/junior.png');
const PRIMARY_AVATAR_URI = require('../../images/primary.png');
const localStyles = {
  badge: {position: 'absolute', right: 20, top: 0},
  level: {position: 'absolute', right: 20, top: 30},
  noData: {flex: 1, justifyContent: 'center', top: 260},
};
export const InterestedSchoolList = (props) => {
  const [schools, setSchools] = useState([]);
  const {navigation, route} = props;
  const editMode = route.params && route.params.editMode;
  const [refreshing, setRefreshing] = React.useState(false);

  const {getInterestedSchools, removeInterestedSchool} = useDao();

  useEffect(() => {
    async function getData() {
      await reload();
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (school) =>
    Alert.alert(
      '删除',
      `确定要删除[${school.name}]吗?`,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            await removeInterestedSchool(school.id);
            await reload();
          },
        },
      ],
      {cancelable: false},
    );
  const reload = async () => {
    const iSchools = await getInterestedSchools();
    setSchools(iSchools.sort((a, b) => a.level - b.level));
  };

  const refresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={STYLES.Styles.FlexOne}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }>
      {schools.length === 0 && (
        <Icon
          containerStyle={localStyles.noData}
          name="database-search"
          type="material-community"
          color={STYLES.Colors.lightSilver}
          size={100}
        />
      )}
      {schools.map((l, i) => (
        <ListItem key={i} bottomDivider>
          {editMode && (
            <TouchableOpacity
              onPress={() => {
                showAlert(l);
              }}>
              <Icon name="circle-with-minus" type="entypo" color="red" />
            </TouchableOpacity>
          )}
          <Avatar
            containerStyle={STYLES.Styles.BackgroundColor()}
            size="medium"
            rounded
            source={l.isJunior ? JUNIOR_AVATAR_URI : PRIMARY_AVATAR_URI}
          />
          <TouchableOpacity
            style={[STYLES.Styles.FlexOne, STYLES.Styles.FlexRowDirection]}
            onPress={() => {
              let curSchool = l;
              if (editMode) {
                navigation.navigate('ManageSchool', curSchool);
              } else {
                navigation.navigate('CommunityList', {
                  communities: curSchool.communities,
                  school: curSchool,
                });
              }
            }}>
            {l.level && (
              <Badge
                status={l.level < 3 ? 'success' : 'primary'}
                value={`梯队${l.level}`}
                containerStyle={localStyles.level}
              />
            )}
            {l.duo && (
              <Badge
                status="success"
                value="双学区或一贯制"
                containerStyle={localStyles.badge}
              />
            )}
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
              <ListItem.Subtitle>{l.addr}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </TouchableOpacity>
        </ListItem>
      ))}
    </ScrollView>
  );
};

export default InterestedSchoolList;

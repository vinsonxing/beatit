import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
  View,
} from 'react-native';
import {ListItem, Icon, Badge} from 'react-native-elements';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';

const localStyles = {
  price: {position: 'absolute', right: 20, top: 30},
  noData: {flex: 1, justifyContent: 'center', top: 260},
  badgeCnt: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    right: 20,
  },
};
export const InterestedCommunityList = (props) => {
  const [communities, setCommunities] = useState([]);
  const {navigation, route} = props;
  const editMode = route.params && route.params.editMode;
  const [refreshing, setRefreshing] = React.useState(false);

  const {getInterestedCommunities, removeInterestedCommunity} = useDao();

  useEffect(() => {
    async function getData() {
      await reload();
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (community) =>
    Alert.alert(
      '删除',
      `确定要删除[${community.vill}]吗?`,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            await removeInterestedCommunity(community.vill);
            await reload();
          },
        },
      ],
      {cancelable: false},
    );
  const reload = async () => {
    const iCommunities = await getInterestedCommunities();
    setCommunities(iCommunities);
  };

  const refresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={[STYLES.Styles.FlexOne]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }>
      {communities.length === 0 && (
        <Icon
          containerStyle={localStyles.noData}
          name="database-search"
          type="material-community"
          color={STYLES.Colors.lightSilver}
          size={100}
        />
      )}
      {communities.map((l, i) => (
        <ListItem key={i} bottomDivider>
          {editMode && (
            <TouchableOpacity
              onPress={() => {
                showAlert(l);
              }}>
              <Icon name="circle-with-minus" type="entypo" color="red" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[STYLES.Styles.FlexOne, STYLES.Styles.FlexRowDirection]}
            onPress={() => {
              let curComm = l;
              if (editMode) {
                navigation.navigate('TagSchool', {
                  vill: curComm.vill,
                  school: curComm.school,
                });
              } else {
                navigation.navigate('HouseList', {
                  community: curComm.vill,
                });
              }
            }}>
            {l.school && (
              <View style={localStyles.badgeCnt}>
                <Badge status={'primary'} value={l.school} />
              </View>
            )}
            <ListItem.Content>
              <ListItem.Title>{l.vill}</ListItem.Title>
              <ListItem.Subtitle>{l.roadarea}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </TouchableOpacity>
        </ListItem>
      ))}
    </ScrollView>
  );
};

export default InterestedCommunityList;

import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
  View,
  Animated,
} from 'react-native';
import {ListItem, Icon, Badge} from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
  addBtn: {
    width: 192,
  },
};

export const InterestedCommunityList = (props) => {
  const [communities, setCommunities] = useState([]);
  const [curComm, setCurComm] = useState({});
  const [openedItemIdx, setOpenedItemIdx] = useState(-1);
  const swiperRef = useRef([]);
  const {navigation, route} = props;
  const editMode = route.params && route.params.editMode;
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    getInterestedCommunities,
    removeInterestedCommunity,
    insertInterestedCommunity,
  } = useDao();

  useEffect(() => {
    async function getData() {
      await reload();
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', async () => {
      await reload();
    });
 
    return () => {
      // Unsubscribe for the focus Listener
      unsubscribe;
    };
  }, [navigation]);

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
    console.log(JSON.stringify(iCommunities));
    setCommunities(iCommunities);
  };

  const refresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const showIcon = (l) =>
    editMode ? (
      <TouchableOpacity
        onPress={() => {
          showAlert(l);
        }}>
        <Icon name="circle-with-minus" type="entypo" color="red" />
      </TouchableOpacity>
    ) : null;

  const addButton = (progress, idx) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [72, 0],
    });

    return (
      <Animated.View
        style={{...localStyles.addBtn, transform: [{translateX: trans}]}}>
        <TouchableOpacity
          style={[
            STYLES.Styles.FlexOne,
            STYLES.Styles.Center,
            STYLES.Styles.BackgroundColor(STYLES.Colors.red),
          ]}
          onPress={async () => {
            curComm.favorite = !curComm.favorite;
            await swiperRef.current[idx].close();
            await insertInterestedCommunity(curComm, !!curComm.favorite);
            await reload();
          }}>
          <Icon
            name={curComm.favorite ? 'pin-off' : 'pin'}
            type="material-community"
            color={STYLES.Colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
    );
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
        <Swipeable
          key={i}
          ref={(el) => {
            if (!swiperRef.current) {
              swiperRef.current = [];
            }
            swiperRef.current[i] = el;
          }}
          rightThreshold={40}
          renderRightActions={(p) => addButton(p, i)}
          onSwipeableRightWillOpen={() => {
            setCurComm(l);
            if (openedItemIdx !== i) {
              swiperRef.current[openedItemIdx]?.close();
            }
            setOpenedItemIdx(i);
          }}>
          <ListItem
            bottomDivider
            containerStyle={
              [l.favorite ? {backgroundColor: STYLES.Colors.lightSilver} : {},
                l.watch ? {borderRightWidth: 5, borderRightColor: "red"}: {}]
            }>
            {showIcon(l)}
            <TouchableOpacity
              style={[STYLES.Styles.FlexOne, STYLES.Styles.FlexRowDirection]}
              onPress={() => {
                let curComm = l;
                if (editMode) {
                  navigation.navigate('TagSchool', {
                    vill: curComm.vill,
                    school: curComm.school,
                    level: curComm.level,
                    jSchool: curComm.jSchool,
                    jLevel: curComm.jLevel,
                    watch: curComm.watch
                  });
                } else {
                  navigation.navigate('HouseList', {
                    community: curComm.vill,
                  });
                }
              }}>
              <View style={localStyles.badgeCnt}>
                {l.school && (
                  <View>
                    <Badge
                      status={l.level < 3 ? 'success' : 'primary'}
                      value={`${l.school}-梯队${l.level || '?'}`}
                    />
                  </View>
                )}
                {l.jSchool && (
                  <View>
                    <Badge
                      status={l.jLevel < 3 ? 'success' : 'primary'}
                      value={`${l.jSchool}-梯队${l.jLevel || '?'}`}
                    />
                  </View>
                )}
              </View>
              <ListItem.Content>
                <ListItem.Title>{l.vill}</ListItem.Title>
                <ListItem.Subtitle>{l.roadarea}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </TouchableOpacity>
          </ListItem>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

export default InterestedCommunityList;

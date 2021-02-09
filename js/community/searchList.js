import React, {useRef, useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {SearchBar, Badge} from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ListItem} from 'react-native-elements';
import useDao from '../hooks/useDao';
import useApi from '../hooks/useApi';
import STYLES from '../../styles';

const localStyles = {
  addBtn: {
    width: 192,
    height: '100%',
  },
  badgeCnt: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    right: 20,
  },
  badge: {},
  noData: {flex: 1, justifyContent: 'center', top: 260},
};

export const CommunitySearchList = (props) => {
  const swiperRef = useRef([]);
  const {state: daoState, addInterestedCommunity} = useDao();
  const {state: cListState, getCommunityListByKeyword} = useApi();
  const [curCommunity, setCurCommunity] = useState();
  const [swiping, setSwiping] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [validCommunities, setValidCommunities] = useState([]);
  const {navigation} = props;

  const addCommunity = async (idx) => {
    await addInterestedCommunity({
      vill: curCommunity.title,
      roadarea: curCommunity.region,
    });
    swiperRef.current[idx]?.close();
  };

  const addButton = (progress, idx) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [192, 0],
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
          onPress={() => addCommunity(idx)}>
          <Text style={STYLES.Styles.Color(STYLES.Colors.white)}>添加</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const searchCommunities = async (text) => {
    setKeyword(text);
    if (!text || text.length < 2) {
      return;
    }
    const communities = await getCommunityListByKeyword(keyword);
    setValidCommunities(Array.isArray(communities) ? communities : []);
  };

  return (
    <View style={STYLES.Styles.FlexOne}>
      <SearchBar
        placeholder="搜索..."
        onChangeText={searchCommunities}
        lightTheme
        value={keyword}
      />
      <ScrollView
        style={STYLES.Styles.FlexOne}
        scrollEnabled={!swiping}
        contentContainerStyle={STYLES.Styles.FlexOne}>
        {(cListState.isFetchingCommunityListByKeyword ||
          daoState.isSavingData) && (
          <View
            style={[
              STYLES.Styles.FlexOne,
              STYLES.Styles.LoadingStyle,
              STYLES.Styles.Center,
            ]}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!cListState.isFetchingCommunityListByKeyword &&
          validCommunities.map((l, i) => (
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
                let s = l;
                setCurCommunity(s);
                setSwiping(true);
              }}
              onSwipeableRightOpen={() => {
                setSwiping(false);
              }}>
              <ListItem key={i} bottomDivider>
                <TouchableOpacity
                  style={[
                    STYLES.Styles.FlexOne,
                    STYLES.Styles.FlexRowDirection,
                  ]}
                  onPress={() => {
                    navigation.navigate('HouseList', {
                      community: l.title,
                    });
                  }}>
                  <View style={localStyles.badgeCnt}>
                    <Badge
                      status={'primary'}
                      value={`${l.count}套房源`}
                      containerStyle={localStyles.badge}
                    />
                  </View>
                  <ListItem.Content>
                    <ListItem.Title>{l.title}</ListItem.Title>
                    <ListItem.Subtitle>{l.region}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </TouchableOpacity>
              </ListItem>
            </Swipeable>
          ))}
      </ScrollView>
    </View>
  );
};

export default CommunitySearchList;

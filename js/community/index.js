import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, Animated, Text} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ListItem} from 'react-native-elements';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';

const localStyle = {
  addBtn: {
    width: 72,
    height: '100%',
  },
};

export const CommunityList = (props) => {
  const {
    state: daoState,
    addInterestedCommunity,
    getInterestedCommunities,
  } = useDao();
  const [curCommunity, setCurCommunity] = useState();
  const [swiping, setSwiping] = useState(false);
  const {navigation, route} = props;
  const {school, communities} = route.params;
  const validCommunities = communities.filter((c) => !!c.vill);
  useEffect(() => {
    navigation.setParams({title: school.name});
    const test = async () => {
      const cc = await getInterestedCommunities();
      console.log(cc);
    };
    test();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCommunity = async () => {
    await addInterestedCommunity(curCommunity);
  };

  const addButton = (progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [72, 0],
    });

    return (
      <Animated.View
        style={{...localStyle.addBtn, transform: [{translateX: trans}]}}>
        <TouchableOpacity
          style={[
            STYLES.Styles.FlexOne,
            STYLES.Styles.Center,
            STYLES.Styles.BackgroundColor(STYLES.Colors.red),
          ]}
          onPress={addCommunity}>
          <Text style={STYLES.Styles.Color(STYLES.Colors.white)}>添加</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={STYLES.Styles.FlexOne}>
      {validCommunities.map((l, i) => (
        <Swipeable
          key={i}
          rightThreshold={40}
          renderRightActions={addButton}
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
              style={[STYLES.Styles.FlexOne, STYLES.Styles.FlexRowDirection]}
              onPress={() => {
                console.log(`Community=${l.vill}`);
                navigation.navigate('HouseList', {
                  community: l.vill,
                });
              }}>
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

export default CommunityList;

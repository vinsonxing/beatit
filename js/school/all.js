import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ListItem, Avatar, SearchBar, Badge} from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import useApi from '../hooks/useApi';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';
import schools from './schools.json';
import duoSchools from './duo-schools.json';

const JUNIOR_AVATAR_URI = require('../../images/junior.png');
const PRIMARY_AVATAR_URI = require('../../images/primary.png');

const localStyles = {
  badge: {position: 'absolute', right: 10, top: 0},
  level: {position: 'absolute', right: 10, top: 30},
};

// format schools
const allSchools = [];
const {primary, junior} = schools;
primary
  .filter((pp) => pp.level !== undefined)
  .sort((a, b) => a.level - b.level)
  .forEach((p) => {
    let sch = {...p, primary: false};
    if (duoSchools.find((ds) => ds.primary.includes(p.value))) {
      sch.duo = true;
    }
    allSchools.push(sch);
  });
junior
  .filter((jj) => jj.level !== undefined)
  .sort((a, b) => a.level - b.level)
  .forEach((j) => {
    let sch = {...j, junior: false};
    if (duoSchools.find((ds) => ds.junior.includes(j.value))) {
      sch.duo = true;
    }
    allSchools.push({...j, junior: true});
  });

const localStyle = {
  addBtn: {
    width: 192,
  },
};

export const AllSchoolList = (props) => {
  const [keyword, setKeyword] = useState('');
  const [swiping, setSwiping] = useState(false);
  const [targetSchools, setTargetSchools] = useState(allSchools);
  const [curSchool, setCurSchool] = useState();
  const [loading, setLoading] = useState(false);

  const {state: apiState, getCommunityList} = useApi();
  const {state: daoState, addInterestedSchool, getInterestedSchools} = useDao();
  const swiperRef = useRef([]);

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const iSchools = await getInterestedSchools();
      const tSchools = allSchools.filter(
        (a) => !iSchools.find((i) => i.id === a.value),
      );
      setTargetSchools(tSchools);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSchool = async (idx) => {
    const communities = await getCommunityList({
      schoolCode: curSchool.value,
      level: curSchool.junior ? 396 : 397,
    });
    await addInterestedSchool(curSchool.value, communities, {
      junior: curSchool.junior || false,
      duo: curSchool.duo,
      level: curSchool.level,
    });
    swiperRef.current[idx]?.close();
  };

  const addButton = (progress, idx) => {
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
          onPress={() => addSchool(idx)}>
          <Text style={STYLES.Styles.Color(STYLES.Colors.white)}>添加</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const updateSearch = (value) => {
    setTargetSchools(allSchools.filter((a) => a.label.includes(value)));
    setKeyword(value);
  };

  return (
    <View style={STYLES.Styles.FlexOne}>
      <SearchBar
        placeholder="搜索..."
        onChangeText={updateSearch}
        lightTheme
        value={keyword}
      />
      <ScrollView style={STYLES.Styles.FlexOne} scrollEnabled={!swiping}>
        {(apiState.isFetchingCommunityList ||
          daoState.isSavingData ||
          loading) && (
          <View style={[STYLES.Styles.LoadingStyle, STYLES.Styles.Center]}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {targetSchools.map((l, i) => {
          return (
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
                setCurSchool(s);
                setSwiping(true);
              }}
              onSwipeableRightOpen={() => {
                setSwiping(false);
              }}>
              <ListItem key={i} disabled={l.added}>
                <Avatar
                  containerStyle={STYLES.Styles.BackgroundColor()}
                  size="medium"
                  rounded
                  source={l.junior ? JUNIOR_AVATAR_URI : PRIMARY_AVATAR_URI}
                />
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                </ListItem.Content>
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
              </ListItem>
            </Swipeable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AllSchoolList;

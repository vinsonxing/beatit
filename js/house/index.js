import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ListItem, Image} from 'react-native-elements';
import useApi from '../hooks/useApi';
import STYLES from '../../styles';

const localStyles = {
  listItemCnt: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  listItemInner: {paddingHorizontal: 10, flex: 1},
  imgSize: {width: 120, height: 120},
  itemPadding: (fz = 12) => ({fontSize: fz, paddingVertical: 3}),
  tagOuter: {
    backgroundColor: STYLES.Colors.success,
    borderRadius: 15,
    paddingTop: 3,
    paddingHorizontal: 3,
    marginRight: 10,
    height: 20,
  },
  tagText: {
    fontSize: 8,
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  priceCnt: {position: 'absolute', right: 10, bottom: 0},
  price: {
    fontSize: 20,
    marginBottom: -2,
    color: STYLES.Colors.error,
    textAlignVertical: 'bottom',
    textAlign: 'right',
  },
};

export const HouseList = (props) => {
  const {
    state: {isFetchingHouseList, houseList},
    getHouseList,
  } = useApi();

  const {navigation, route} = props;
  const {community} = route.params;

  useEffect(() => {
    console.log('test start');
    navigation.setParams({title: community});
    getHouseList(community);
    console.log('test end');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('render');
  return (
    <ScrollView
      style={STYLES.Styles.FlexOne}
      contentContainerStyle={isFetchingHouseList ? STYLES.Styles.FlexOne : {}}>
      {isFetchingHouseList && (
        <View
          style={[
            STYLES.Styles.LoadingStyle,
            STYLES.Styles.FlexOne,
            STYLES.Styles.Center,
          ]}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {houseList &&
        houseList.map((h, i) => (
          <ListItem key={i} bottomDivider>
            <TouchableOpacity
              style={[STYLES.Styles.FlexOne]}
              onPress={() => {
                navigation.navigate('HouseDetail', {
                  house: h,
                });
              }}>
              <View
                style={[STYLES.Styles.FlexOne, STYLES.Styles.FlexRowDirection]}>
                <Image
                  source={h.img ? {uri: h.img} : {}}
                  style={localStyles.imgSize}
                />
                <ListItem.Content style={localStyles.listItemCnt}>
                  <View style={localStyles.listItemInner}>
                    <ListItem.Subtitle
                      numberOfLines={2}
                      style={localStyles.itemPadding()}>
                      {h.title}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle
                      numberOfLines={2}
                      style={localStyles.itemPadding()}>
                      {h.houseInfo}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={localStyles.itemPadding()}>
                      {h.positionInfo}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={localStyles.itemPadding()}>
                      {h.followInfo && h.followInfo.split('/')[0]}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={localStyles.itemPadding()}>
                      {h.followInfo && h.followInfo.split('/')[1]}
                    </ListItem.Subtitle>
                    <View
                      style={[
                        STYLES.Styles.FlexOne,
                        STYLES.Styles.FlexRowDirection,
                        localStyles.flexEnd,
                      ]}>
                      {h.tag &&
                        h.tag.map((t, idx) => {
                          if (idx > 1) {
                            return null;
                          }
                          return (
                            <View key={idx} style={localStyles.tagOuter}>
                              <Text style={localStyles.tagText}>{t}</Text>
                            </View>
                          );
                        })}
                    </View>
                    <View style={localStyles.priceCnt}>
                      <ListItem.Subtitle style={localStyles.itemPadding(10)}>
                        {h.unitPrice || ""}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle style={localStyles.price}>
                        {h.priceInfo}
                      </ListItem.Subtitle>
                    </View>
                  </View>
                </ListItem.Content>
              </View>
            </TouchableOpacity>
            <ListItem.Chevron />
          </ListItem>
        ))}
    </ScrollView>
  );
};

export default HouseList;

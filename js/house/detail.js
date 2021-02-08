import React, {useEffect} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import useApi from '../hooks/useApi';
import STYLES from '../../styles';
import PinchableBox from './pinchableBox';

const localStyles = {
  noData: {flex: 1, justifyContent: 'center', top: 260},
};
export const HouseDetail = (props) => {
  const {
    state: {isFetchingHouse, houseDetail},
    getHouseDetail,
  } = useApi();

  const {route} = props;
  const {house} = route.params;

  useEffect(() => {
    getHouseDetail(house.detailLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView
      style={STYLES.Styles.FlexOne}
      contentContainerStyle={isFetchingHouse ? STYLES.Styles.FlexOne : {}}>
      {isFetchingHouse && (
        <View
          style={[
            STYLES.Styles.LoadingStyle,
            STYLES.Styles.FlexOne,
            STYLES.Styles.Center,
          ]}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {(!houseDetail || houseDetail.length === 0) && (
        <Icon
          containerStyle={localStyles.noData}
          name="database-search"
          type="material-community"
          color={STYLES.Colors.lightSilver}
          size={100}
        />
      )}
      {houseDetail &&
        houseDetail.length > 1 &&
        houseDetail.map((h, i) => (
          <ListItem key={i} bottomDivider>
            <View
              style={[STYLES.Styles.FlexOne, STYLES.Styles.PaddingHorizontal]}>
              <PinchableBox imageUri={h.housePic} />
            </View>
          </ListItem>
        ))}
    </ScrollView>
  );
};

export default HouseDetail;

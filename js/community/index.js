import React, {useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import STYLES from '../../styles';

export const CommunityList = (props) => {
  const {navigation, route} = props;
  const {school, communities} = route.params;
  const validCommunities = communities.filter((c) => !!c.vill);
  useEffect(() => {
    navigation.setParams({title: school.name});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={STYLES.Styles.FlexOne}>
      {validCommunities.map((l, i) => (
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
      ))}
    </ScrollView>
  );
};

export default CommunityList;

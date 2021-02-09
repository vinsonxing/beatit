/* eslint-disable radix */
import React, {useState} from 'react';
import {Input, Card, Button} from 'react-native-elements';
import {ScrollView} from 'react-native';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';

export const TagSchool = (props) => {
  const {navigation, route} = props;
  const {getInterestedCommunities, addInterestedCommunity} = useDao();
  const [community, setCommunity] = useState(route.params?.vill);
  const [school, setSchool] = useState(route.params?.school);

  const save = async () => {
    const iComms = await getInterestedCommunities();
    const targetComm = iComms.find((c) => c.vill === community);
    if (targetComm) {
      await addInterestedCommunity({...targetComm, school});
    }
    navigation.goBack();
  };
  return (
    <ScrollView style={STYLES.Styles.FlexOne}>
      <Card>
        <Card.Title>基本信息</Card.Title>
        <Input
          disabled
          placeholder="小区"
          value={community}
          onChangeText={(v) => setCommunity(v)}
        />
        <Input
          placeholder="学校名称"
          value={school}
          onChangeText={(v) => setSchool(v)}
        />
        <Button title="保存" onPress={save} />
      </Card>
    </ScrollView>
  );
};

export default TagSchool;

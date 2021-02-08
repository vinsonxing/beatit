/* eslint-disable radix */
import React, {useState, createRef} from 'react';
import {Input, Card, Button} from 'react-native-elements';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
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

const styles = {
  hiddenPicker: {
    position: 'absolute',
    left: -1000,
  },
  pickerContainer: {
    height: 40,
    borderBottomColor: STYLES.Colors.grey0,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  pickerContent: {
    fontSize: 18,
    top: 10,
  },
};

export default TagSchool;

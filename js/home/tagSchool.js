/* eslint-disable radix */
import React, {useState, useRef} from 'react';
import {Input, Card, Button, CheckBox} from 'react-native-elements';
import {ScrollView, View, TouchableOpacity, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import useDao from '../hooks/useDao';
import STYLES from '../../styles';

export const TagSchool = (props) => {
  const {navigation, route} = props;
  const {getInterestedCommunities, addInterestedCommunity, insertInterestedCommunity} = useDao();
  const [community] = useState(route.params?.vill);
  const [newCommunity, setNewCommunity] = useState(route.params?.vill);
  const [school, setSchool] = useState(route.params?.school);
  const [jSchool, setJSchool] = useState(route.params?.jSchool);
  const [level, setLevel] = useState(route.params?.level || 0);
  const [jLevel, setJLevel] = useState(route.params?.jLevel || 0);
  const [watch, setWatch] = useState(route.params?.watch || false);
  const pPickerRef = useRef();
  const jPickerRef = useRef();



  const levels = [
    {label: '第一梯度', value: '1'},
    {label: '第二梯度', value: '2'},
    {label: '第三梯度', value: '3'},
    {label: '第四梯度', value: '4'},
  ];

  const getLevel = (value) => {
    const item = levels.find((v) => v.value === '' + value);
    return item?.label || '';
  };

  const levelColorObj = (lco) =>
    lco === 0
      ? {
          color: STYLES.Colors.grey3,
        }
      : {};

  const save = async () => {
    const iComms = await getInterestedCommunities();
    const targetComm = iComms.find((c) => c.vill === community);
    if (targetComm) {
      if (!watch && targetComm.favorite)  {
        targetComm.favorite = false;
      }
      await insertInterestedCommunity({
        ...targetComm,
        vill: newCommunity,
        school,
        level,
        jSchool,
        jLevel,
        watch
      }, watch);
    }
    navigation.goBack({refresh: true});
  };

  return (
    <ScrollView style={STYLES.Styles.FlexOne}>
      <Card>
        <Card.Title>基本信息</Card.Title>
        <Input
          placeholder="小区"
          value={newCommunity}
          onChangeText={(v) => {setNewCommunity(v)}}
        />

        <Card.Title>小学</Card.Title>
        <Input
          placeholder="名称"
          value={school}
          onChangeText={(v) => setSchool(v)}
        />
        <TouchableOpacity
          onPress={() => {
            pPickerRef.current.togglePicker(true);
          }}>
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerContent, levelColorObj(level)]}>
              {getLevel(level) || '等级'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.hiddenPicker}>
          <RNPickerSelect
            ref={pPickerRef}
            onValueChange={(value) => setLevel(parseInt(value || 0))}
            items={levels}
          />
        </View>
        <Card.Title>初中</Card.Title>
        <Input
          placeholder="名称"
          value={jSchool}
          onChangeText={(v) => setJSchool(v)}
        />
        <TouchableOpacity
          onPress={() => {
            jPickerRef.current.togglePicker(true);
          }}>
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerContent, levelColorObj(jLevel)]}>
              {getLevel(jLevel) || '等级'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.hiddenPicker}>
          <RNPickerSelect
            ref={jPickerRef}
            onValueChange={(value) => setJLevel(parseInt(value || 0))}
            items={levels}
          />
        </View>
        <CheckBox
          title="特别关注"
          checked={watch}
          onPress={() => setWatch(!watch)}
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

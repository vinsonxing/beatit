/* eslint-disable radix */
import React, {useState, createRef} from 'react';
import {Input, Card, CheckBox} from 'react-native-elements';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import STYLES from '../../styles';

export const ManageSchool = (props) => {
  const {navigation, route} = props;
  const params = route.params;

  const [id, setId] = useState(params?.id);
  const [name, setName] = useState(params?.name);
  const [addr, setAddr] = useState(params?.addr);
  const [special, setSpecial] = useState(params?.special);
  const [level, setLevel] = useState(params?.level || 0);
  const [junior, setJunior] = useState(params?.junior || false);

  const pickerRef = createRef();

  const levels = [
    {label: '第一梯度', value: '1'},
    {label: '第二梯度', value: '2'},
    {label: '第三梯度', value: '3'},
  ];

  const getLevel = (value) => {
    const item = levels.find((v) => v.value === '' + value);
    return item.label;
  };

  const levelColorObj =
    level === 0
      ? {
          color: STYLES.Colors.grey3,
        }
      : {};
  const idStr = id ? '' + id : '';
  return (
    <ScrollView style={STYLES.Styles.FlexOne}>
      <Card>
        <Card.Title>基本信息</Card.Title>
        <Input
          placeholder="编号"
          value={idStr}
          onChangeText={(v) => setId(v)}
        />
        <Input
          placeholder="学校名称"
          value={name}
          onChangeText={(v) => setName(v)}
        />
        <Input
          placeholder="学校地址"
          value={addr}
          nChangeText={(v) => setAddr(v)}
        />
        {/* <Card.Divider /> */}
        <Card.Title>学校水平</Card.Title>
        <TouchableOpacity
          onPress={() => {
            pickerRef.current.togglePicker(true);
          }}>
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerContent, levelColorObj]}>
              {level === 0 ? '等级' : getLevel(level)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.hiddenPicker}>
          <RNPickerSelect
            ref={pickerRef}
            onValueChange={(value) => setLevel(parseInt(value || 0))}
            items={levels}
          />
        </View>
        <Input
          placeholder="特色"
          value={special}
          onChangeText={(v) => setSpecial(v)}
        />
        <CheckBox
          title="初中"
          checked={junior}
          onPress={() => setJunior(!junior)}
        />
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

export default ManageSchool;

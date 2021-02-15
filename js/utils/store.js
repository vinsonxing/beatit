import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    let storeValue;
    if (typeof value === 'string') {
      storeValue = value;
    } else if (typeof value === 'object') {
      storeValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, storeValue);
  } catch (e) {
    console.warn(`store data error key=${key} value=${JSON.stringify(value)}`);
  }
};

export const getData = async (key) => {
  let ret = null;
  try {
    ret = await AsyncStorage.getItem(key);
    return ret != null ? JSON.parse(ret) : null;
  } catch (e) {
    // may not json object
    return ret;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // may not json object
    console.warn('should not be here');
  }
};

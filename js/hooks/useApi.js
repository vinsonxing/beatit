import {useState} from 'react';
import {NativeModules} from 'react-native';
import {HttpService} from '../utils/dal';
import * as Schema from './schema';

const {HtmlParser} = NativeModules;
const getCommunitiesURL = (code) =>
  `http://s1.shanghaicity.openservice.kankanews.com/searchschool/schoolsearch.php?act=getresult&condition=school&getid=${code}&level=397&area=420`;

const getHouseListURL = (community) =>
  `https://sh.lianjia.com/ershoufang/rs${encodeURI(community)}`;

const useApi = () => {
  const [communityList, setCommunityList] = useState([]);
  const [isFetchingCommunityList, setIsFetchingCommunityList] = useState(false);
  const [isCommunityListError, setIsCommunityListError] = useState(false);

  const [houseList, setHouseList] = useState([]);
  const [isFetchingHouseList, setIsFetchingHouseList] = useState(false);
  const [isHouseListError, setIsHouseListError] = useState(false);

  const [houseDetail, setHouseDetail] = useState([]);
  const [isFetchingHouse, setIsFetchingHouse] = useState(false);
  const [isHouseError, setIsHouseError] = useState(false);

  const getCommunityList = async (queryOptions) => {
    const {schoolCode} = queryOptions;
    try {
      setIsCommunityListError(false);
      setIsFetchingCommunityList(true);
      const url = getCommunitiesURL(schoolCode);
      const result = await HttpService.getData(url);
      setCommunityList(result);
      return result;
    } catch (error) {
      setIsCommunityListError(true);
      return [];
    } finally {
      setIsFetchingCommunityList(false);
    }
  };

  // return house list with price
  const getHouseList = async (community) => {
    try {
      setIsHouseListError(false);
      setIsFetchingHouseList(true);
      const url = getHouseListURL(community);
      const result = await HtmlParser.parse(url, Schema.houseListSchemas);
      setHouseList(result);
      return result;
    } catch (error) {
      setIsHouseListError(true);
      return [];
    } finally {
      setIsFetchingHouseList(false);
    }
  };

  // return house pictures
  // 'https://sh.lianjia.com/ershoufang/107103448110.html'
  const getHouseDetail = async (url, detail) => {
    try {
      setIsHouseError(false);
      setIsFetchingHouse(true);
      const result = await HtmlParser.parse(url, Schema.houseDetailSchema);
      setHouseDetail(result);
      return {...detail, imgs: result};
    } catch (error) {
      setIsHouseError(true);
      return {...detail, imgs: []};
    } finally {
      setIsFetchingHouse(false);
    }
  };

  return {
    state: {
      communityList,
      isFetchingCommunityList,
      isCommunityListError,

      houseList,
      isFetchingHouseList,
      isHouseListError,

      houseDetail,
      isFetchingHouse,
      isHouseError,
    },
    getCommunityList,
    getHouseList,
    getHouseDetail,
  };
};

export default useApi;

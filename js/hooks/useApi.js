import {useState} from 'react';
import {NativeModules} from 'react-native';
import {HttpService} from '../utils/dal';
import * as Schema from './schema';

const {HtmlParser} = NativeModules;
const getCommunitiesURL = (code, level) =>
  `http://s1.shanghaicity.openservice.kankanews.com/searchschool/schoolsearch.php?act=getresult&condition=school&getid=${code}&level=${level}&area=420`;

const getHouseListURL = (community) =>
  `https://sh.lianjia.com/ershoufang/rs${encodeURI(community)}`;

const getCommunityListByKeywordURL = (kw) =>
  `https://sh.lianjia.com/api/headerSearch?channel=ershoufang&cityId=310000&keyword=${encodeURI(
    kw,
  )}`;
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

  const [communityDetail, setCommunityDetail] = useState([]);
  const [isFetchingCommunity, setIsFetchingCommunity] = useState(false);
  const [isCommunityError, setIsCommunityError] = useState(false);

  const [communityListByKeyword, setCommunityListByKeyword] = useState([]);
  const [
    isFetchingCommunityListByKeyword,
    setIsFetchingCommunityListByKeyword,
  ] = useState(false);
  const [
    isCommunityListByKeywordError,
    setIsCommunityListByKeywordError,
  ] = useState(false);

  const getCommunityList = async (queryOptions) => {
    const {schoolCode, level} = queryOptions;
    try {
      setIsCommunityListError(false);
      setIsFetchingCommunityList(true);
      const url = getCommunitiesURL(schoolCode, level);
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

  const getCommunityDetail = async (url) => {
    try {
      setIsCommunityError(false);
      setIsFetchingCommunity(true);
      const result = await HtmlParser.parse(url, Schema.communityDetailScheme);
      if (Array.isArray(result) && result.length > 0) {
        setCommunityDetail(result[0]);
        return result[0];
      }
      return {};
    } catch (error) {
      setIsCommunityError(true);
      return {};
    } finally {
      setIsFetchingCommunity(false);
    }
  };

  const getCommunityListByKeyword = async (kw) => {
    try {
      setIsCommunityListByKeywordError(false);
      setIsFetchingCommunityListByKeyword(true);
      const url = getCommunityListByKeywordURL(kw);
      console.log(url);
      const result = await HttpService.getData(url);
      let data = [];
      if (
        result.errno === 0 &&
        result.data &&
        result.data.data &&
        Array.isArray(result.data.data.result)
      ) {
        data = result.data.data.result;
      }
      setCommunityListByKeyword(data);
      return data;
    } catch (error) {
      setIsCommunityListByKeywordError(true);
      return [];
    } finally {
      setIsFetchingCommunityListByKeyword(false);
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

      communityDetail,
      isFetchingCommunity,
      isCommunityError,

      communityListByKeyword,
      isFetchingCommunityListByKeyword,
      isCommunityListByKeywordError,
    },
    getCommunityList,
    getHouseList,
    getHouseDetail,
    getCommunityDetail,
    getCommunityListByKeyword,
  };
};

export default useApi;

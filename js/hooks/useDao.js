import {useState} from 'react';
import * as Store from '../utils/store';
import * as Constants from '../utils/constants';

const useDao = () => {
  const [isSavingData, setIsSavingData] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  /**
   * structure
   * {
   *  "interested_schools":[{
   *    id: "",
   *    name: "",
   *    addr: "",
   *    communities: [],
   *    {*}
   *  }]
   * }
   * @param {*} school
   * @param {*} code
   */
  const addInterestedSchool = async (code, communities, params = {}) => {
    try {
      setIsSavingData(true);
      setIsSaved(false);
      // refresh interested school list
      let iSchools = await Store.getData(Constants.INTERESTED_SCHOOLS);
      if (iSchools == null) {
        iSchools = [];
      }
      // filter out the old data is exists
      const newData = iSchools.filter((s) => s.id !== code);
      // populate data
      const community = communities.find((c) => c.id === '' + code);
      const addition = {
        id: code,
        name: community?.school,
        addr: community?.roadarea,
        communities,
        ...params,
      };
      newData.push(addition);
      newData.sort((a, b) => a.name.localeCompare(b.name));
      await Store.storeData(Constants.INTERESTED_SCHOOLS, newData);
      setIsSaved(true);
    } catch (error) {
      console.warn('Should not go here');
    } finally {
      setIsSavingData(false);
    }
  };

  const getInterestedSchools = async () => {
    const iSchools = await Store.getData(Constants.INTERESTED_SCHOOLS);
    return Array.isArray(iSchools) && iSchools.length > 0 ? iSchools : [];
  };

  // replace all schools
  const addInterestedSchools = async (schools) => {
    try {
      setIsSavingData(true);
      setIsSaved(false);
      await Store.storeData(Constants.INTERESTED_SCHOOLS, schools);
      setIsSaved(true);
    } catch (error) {
      console.warn('Should not go here');
    } finally {
      setIsSavingData(false);
    }
  };

  const removeInterestedSchool = async (code) => {
    const schools = await getInterestedSchools();
    if (Array.isArray(schools)) {
      const remainSchools = schools.filter((s) => s.id !== code);
      await Store.storeData(Constants.INTERESTED_SCHOOLS, remainSchools);
    }
  };

  const addInterestedCommunity = async (community, params = {}) => {
    await _addInterestedCommunity(community, false, params);
  };

  const _addInterestedCommunity = async (community, insert, params = {}) => {
    try {
      setIsSavingData(true);
      setIsSaved(false);
      // refresh interested school list
      let iCommunities = await Store.getData(Constants.INTERESTED_COMMUNITIES);
      if (iCommunities == null) {
        iCommunities = [];
      }
      // filter out the old data is exists
      const newData = iCommunities.filter((s) => s.vill !== community.vill);
      if (insert) {
        newData.unshift({
          ...community,
          ...params,
        });
      } else {
        newData.push({
          ...community,
          ...params,
        });
      }
      newData.sort();
      await Store.storeData(Constants.INTERESTED_COMMUNITIES, newData);
      setIsSaved(true);
    } catch (error) {
      console.warn('Should not go here');
    } finally {
      setIsSavingData(false);
    }
  };

  const insertInterestedCommunity = async (community, insert, params = {}) => {
    await _addInterestedCommunity(community, insert, params);
  };

  const getInterestedCommunities = async () => {
    const iCommunities = await Store.getData(Constants.INTERESTED_COMMUNITIES);
    return Array.isArray(iCommunities) && iCommunities.length > 0
      ? iCommunities
      : [];
  };

  const addInterestedCommunities = async (communities) => {
    try {
      setIsSavingData(true);
      setIsSaved(false);
      await Store.storeData(Constants.INTERESTED_COMMUNITIES, communities);
      setIsSaved(true);
    } catch (error) {
      console.warn('Should not go here');
    } finally {
      setIsSavingData(false);
    }
  };

  const removeInterestedCommunity = async (community) => {
    const iCommunities = await getInterestedCommunities();
    if (Array.isArray(iCommunities)) {
      const remainCommunities = iCommunities.filter(
        (s) => s.vill !== community,
      );
      await Store.storeData(
        Constants.INTERESTED_COMMUNITIES,
        remainCommunities,
      );
    }
  };

  const cleanInterestedCommunities = async () => {
    await Store.removeData(Constants.INTERESTED_COMMUNITIES);
  };

  const cleanInterestedSchools = async () => {
    await Store.removeData(Constants.INTERESTED_SCHOOLS);
  };

  return {
    state: {
      isSavingData,
      isSaved,
    },
    addInterestedSchool,
    getInterestedSchools,
    removeInterestedSchool,
    addInterestedCommunity,
    insertInterestedCommunity,
    getInterestedCommunities,
    removeInterestedCommunity,
    cleanInterestedCommunities,
    cleanInterestedSchools,
    addInterestedCommunities,
    addInterestedSchools,
  };
};

export default useDao;

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

  const removeInterestedSchool = async (code) => {
    const schools = await getInterestedSchools();
    if (Array.isArray(schools)) {
      const remainSchools = schools.filter((s) => s.id !== code);
      await Store.storeData(Constants.INTERESTED_SCHOOLS, remainSchools);
    }
  };

  return {
    state: {
      isSavingData,
      isSaved,
    },
    addInterestedSchool,
    getInterestedSchools,
    removeInterestedSchool,
  };
};

export default useDao;

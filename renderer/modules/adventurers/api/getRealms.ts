import axios from 'axios';
import { RealmType } from '../types/realms';

const graphEndpoint = 'https://api.thegraph.com/subgraphs/name/jona/realm-v2';

export const getRealms = async (address: string, withReactor: boolean): Promise<RealmType[]> => {
  const { data } = await axios.post(graphEndpoint, {
    query: `
    query ExampleQuery {
      realms(first: 1000, where: { 
        owner: "${address.toLowerCase()}"
      }) {
        id
        feature1
        feature2
        feature3   
        structures {
          id
        }
      }
    }
    `
  });

  const filteredRealms = data.data.realms.filter((realm: any) => {
    if(withReactor) {
      // If withReactor is true, return realms where structures is not empty
      return realm.structures.length > 0;
    } else {
      // If withReactor is false, return realms where structures is empty
      return realm.structures.length === 0;
    }
  });

  return filteredRealms.map((i: any) => {
    return {
      id: i.id,
      feature1: i.feature1,
      feature2: i.feature2,
      feature3: i.feature3
    };
  });
};

import axios from 'axios';
import { ethers } from 'ethers';
import { AdventurerType } from '../types/adventurer';


const graphEndpoint = 'https://api.thegraph.com/subgraphs/name/jona/realm-v2';

export const getAdventurers = async (address: string): Promise<AdventurerType[]> => {
  const { data } = await axios.post(graphEndpoint, {
    query: `
    query ExmapleQuery {
      adventurers(first: 1000, where: { 
      attackEpoch_not: "${currentEpoch()}",
      exitArenaAt_not: 0,
      exitArenaAt_gte:${Math.round(Date.now() / 1000)},
      owner: "${address.toLowerCase()}"
      }) {
        id
        address
        tokenId,
        createdAt
        owner
        archetype
        profession
        klass
        level
        xp
        hp
        battles
        strength
        dexterity
        intelligence
        charisma
        constitution
        wisdom,
        exitArenaAt
      }
    }
    `
  });
  return data.data.adventurers.map((i: any) => {
    return {
      ...i,
      strength: parseInt(i.strength, 10),
      dexterity: parseInt(i.dexterity, 10),
      intelligence: parseInt(i.intelligence, 10),
      charisma: parseInt(i.charisma, 10),
      constitution: parseInt(i.constitution, 10),
      wisdom: parseInt(i.wisdom, 10)
    };
  });
};
function currentEpoch() {
  return Math.floor((4826692800 - Math.floor(Date.now() / 1000)) / 86400)
}
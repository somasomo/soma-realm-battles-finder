import axios from 'axios';
import { ethers } from 'ethers';
import { AdventurerType } from '../types/adventurer';

export const CONTRACT_ADDRESS = '0x71f5C328241fC3e03A8c79eDCD510037802D369c';

const graphEndpoint = 'https://api.thegraph.com/subgraphs/name/jona/realm-v2';

export const getAdventurers = async (address: string): Promise<AdventurerType[]> => {
  const { data } = await axios.post(graphEndpoint, {
    query: `
    query ExmapleQuery{
      adventurers(first: 1000, where: { owner: "${address.toLowerCase()}"}) {
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
        wisdom
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

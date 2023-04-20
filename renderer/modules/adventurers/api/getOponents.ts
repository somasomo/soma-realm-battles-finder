import axios from 'axios';
import { AdventurerType } from '../types/adventurer';
const graphEndpoint = 'https://api.thegraph.com/subgraphs/name/jona/realm-v2';

function getProbWinning(advA: AdventurerType, advB: AdventurerType) {
  let prob = 0;

  if (advA.charisma > advB.charisma) {
    prob++;
  }
  if (advA.strength > advB.strength) {
    prob++;
  }

  if (advA.intelligence > advB.intelligence) {
    prob++;
  }

  if (advA.constitution > advB.constitution) {
    prob++;
  }
  if (advA.wisdom > advB.wisdom) {
    prob++;
  }

  if (advA.dexterity > advB.dexterity) {
    prob++;
  }

  return prob;
}

async function getOponent(
  adventurer: AdventurerType,
  maxDownside = 20,
  maxUpside = 0
): Promise<AdventurerType[]> {
  const min_charisma = adventurer.charisma - maxDownside <= 0 ? 0 : adventurer.charisma - maxDownside;
  const max_charisma = adventurer.charisma + maxUpside <= 0 ? 0 : adventurer.charisma + maxUpside;
  const min_wisdom = adventurer.wisdom - maxDownside <= 0 ? 0 : adventurer.wisdom - maxDownside;
  const max_wisdom = adventurer.wisdom + maxUpside <= 0 ? 0 : adventurer.wisdom + maxUpside;
  const min_intelligence =
    adventurer.intelligence - maxDownside <= 0 ? 0 : adventurer.intelligence - maxDownside;
  const max_intelligence = adventurer.intelligence + maxUpside <= 0 ? 0 : adventurer.intelligence + maxUpside;
  const min_strength = adventurer.strength - maxDownside <= 0 ? 0 : adventurer.strength - maxDownside;
  const max_strength = adventurer.strength + maxUpside <= 0 ? 0 : adventurer.strength + maxUpside;
  const min_constitution =
    adventurer.constitution - maxDownside <= 0 ? 0 : adventurer.constitution - maxDownside;
  const max_constitution = adventurer.constitution + maxUpside <= 0 ? 0 : adventurer.constitution + maxUpside;
  const min_dexterity = adventurer.dexterity - maxDownside <= 0 ? 0 : adventurer.dexterity - maxDownside;
  const max_dexterity = adventurer.dexterity + maxUpside <= 0 ? 0 : adventurer.dexterity + maxUpside;

  const { data } = await axios.post(graphEndpoint, {
    query: `
        query ExmapleQuery{
          adventurers(first: 100, where: { 
            charisma_gte: ${min_charisma},
            charisma_lte: ${max_charisma},
            wisdom_gte: ${min_wisdom},
            wisdom_lte: ${max_wisdom},
            intelligence_gte: ${min_intelligence},
            intelligence_lte: ${max_intelligence},
            strength_gte: ${min_strength},
            strength_lte: ${max_strength},
            owner_not: "${adventurer.owner}"
            lastBattledAt_lte: ${Math.round(Date.now() / 1000)},
            constitution_gte: ${min_constitution},
            constitution_lte: ${max_constitution},
            dexterity_gte: ${min_dexterity},
            dexterity_lte: ${max_dexterity}
        
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
            wisdom
          }
        }
        `
  });
  const advs = data.data.adventurers.map((i: any) => {
    return {
      ...i,
      strength: parseInt(i.strength, 10),
      dexterity: parseInt(i.dexterity, 10),
      intelligence: parseInt(i.intelligence, 10),
      charisma: parseInt(i.charisma, 10),
      constitution: parseInt(i.constitution, 10),
      wisdom: parseInt(i.wisdom, 10)
    };
  }) as AdventurerType[];

  return advs
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .sort((a, b) => {
      const probWining = getProbWinning(adventurer, a);
      const probWiningB = getProbWinning(adventurer, b);
      return probWining > probWiningB ? -1 : 1;
    });
}
export async function getOponents(
  adventurers: AdventurerType[],
  maxDownside = 20,
  maxUpside = 0
): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];
  await Promise.all(
    adventurers.map(async adv => {
      const enemies = await getOponent(adv, maxDownside, maxUpside);

      enemies.forEach(enemy => {
        if (!map[adv.tokenId] && enemy.tokenId !== adv.tokenId) {
          if (!used.includes(enemy.tokenId)) {
            map[adv.tokenId] = enemy;
            used.push(enemy.tokenId);
          }
        }
      });
      return enemies;
    })
  );

  return map;
}

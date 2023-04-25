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
  winIt: boolean,
  maxAdvantageTraits = 1,
  maxUpside = 0
): Promise<AdventurerType[]> {
  const min_charisma = Math.floor(adventurer.charisma /2);
  const max_charisma = adventurer.charisma + maxUpside;
  const min_wisdom = Math.floor(adventurer.wisdom/2);
  const max_wisdom = adventurer.wisdom + maxUpside;
  const min_intelligence = Math.floor(adventurer.intelligence /2);
  const max_intelligence = adventurer.intelligence + maxUpside;
  const min_strength = Math.floor(adventurer.strength/2);
  const max_strength = adventurer.strength + maxUpside;
  const min_constitution = Math.floor(adventurer.constitution/2);
  const max_constitution = adventurer.constitution + maxUpside;
  const min_dexterity = Math.floor(adventurer.dexterity /2);
  const max_dexterity = adventurer.dexterity + maxUpside;

  const { data } = await axios.post(graphEndpoint, {
    query: `
        query ExmapleQuery{
          adventurers(first: 1000, where: { 
            charisma_gte: ${min_charisma},
            charisma_lte: ${max_charisma},
            wisdom_gte: ${min_wisdom},
            wisdom_lte: ${max_wisdom},
            intelligence_gte: ${min_intelligence},
            intelligence_lte: ${max_intelligence},
            strength_gte: ${min_strength},
            strength_lte: ${max_strength},
            owner_not: "${adventurer.owner}"
            constitution_gte: ${min_constitution},
            constitution_lte: ${max_constitution},
            dexterity_gte: ${min_dexterity},
            dexterity_lte: ${max_dexterity},
            tokenId_not: "${adventurer.tokenId}"
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
      wisdom: parseInt(i.wisdom, 10),
      klass: parseInt(i.klass, 10)
    };
  }) as AdventurerType[];

  return advs
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .filter(enemy => isSuitableOpponent(adventurer, enemy, maxAdvantageTraits, winIt))
    .sort((a, b) => compareAdventurers(a, b, adventurer, winIt));
}
export async function getOpponents(
  adventurers: AdventurerType[],
  maxAdvantageTraits = 1,
  maxUpside = 0
): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];
  await Promise.all(
    adventurers.map(async adv => {
      const enemies = await getOponent(adv,true, maxAdvantageTraits, maxUpside);

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
export async function getOpponentsAuto(
  adventurers: AdventurerType[],
  winIt: boolean 
  ): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];

  let maxAdvantageTraits = 0;
  let maxUpside = 1;

  let remainingAdventurers = [...adventurers];

  while (remainingAdventurers.length > 0 && maxAdvantageTraits <= 6) {
    await Promise.all(
      remainingAdventurers.map(async adv => {
        const enemies = await getOponent(adv, winIt,  maxAdvantageTraits, maxUpside);

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

    remainingAdventurers = remainingAdventurers.filter(adv => !map[adv.tokenId]);

    if (maxUpside < 5) {
      maxUpside++;
    } else {
      maxUpside = 1;
      maxAdvantageTraits++;
    }
  }

  return map;
}
function compareAdventurers(advA: AdventurerType, advB: AdventurerType, reference: AdventurerType, winIt: boolean): number {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'];
  let scoreA = 0;
  let scoreB = 0;
  let losingPreference = 3;
if (winIt) losingPreference = 1;

  categories.forEach(category => {
    const diffA = advA[category] - reference[category];
    const diffB = advB[category] - reference[category];

    if (diffA > 0) {
      scoreA += (1 / diffA) * losingPreference; // Reward for being stronger with smaller difference
    } else {
      scoreA -= diffA; // Reward for being weaker with larger difference
    }

    if (diffB > 0) {
      scoreB += (1 / diffB) * losingPreference; // Reward for being stronger with smaller difference
    } else {
      scoreB -= diffB; // Reward for being weaker with larger difference
    }
  });

  return scoreA > scoreB ? -1 : 1;
}
function isSuitableOpponent(advA: AdventurerType, advB: AdventurerType, maxAdvantageTraits: number, winIt: boolean): boolean {
  let weakerCategories = 0;

  if (advA.charisma >= advB.charisma) {
    weakerCategories++;
  } 
  if (advA.strength >= advB.strength) {
    weakerCategories++;
  } 
  if (advA.intelligence >= advB.intelligence) {
    weakerCategories++;
  } 
  if (advA.constitution >= advB.constitution) {
    weakerCategories++;
  } 
  if (advA.wisdom >= advB.wisdom) {
    weakerCategories++;
  } 
  if (advA.dexterity >= advB.dexterity) {
    weakerCategories++;
  } 

  return weakerCategories <= maxAdvantageTraits;
}
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
  opponents: AdventurerType[],
  levelSwitch:number = 13
): Promise<AdventurerType[]> {
  const advs = opponents;

  return advs
    .filter(enemy => adventurer.level > levelSwitch)
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .sort((a, b) => compareAdventurers(a, b, adventurer, winIt));
}

async function getOponentLootboxes(
  adventurer: AdventurerType,
  opponents: AdventurerType[],
  levelSwitch:number = 13,
  strengthFactor :number = 2.0
): Promise<AdventurerType[]> {
  const advs = opponents;

  return advs
    .filter(enemy => adventurer.level <= levelSwitch)
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .sort((a, b) => compareAdventurersLootboxes(a, b, adventurer, strengthFactor));
}

async function OponentQuery(adventurer: AdventurerType, maxUpside: number) {
  const min_charisma = Math.floor(adventurer.charisma / 2);
  const max_charisma = adventurer.charisma + maxUpside;
  const min_wisdom = Math.floor(adventurer.wisdom / 2);
  const max_wisdom = adventurer.wisdom + maxUpside;
  const min_intelligence = Math.floor(adventurer.intelligence / 2);
  const max_intelligence = adventurer.intelligence + maxUpside;
  const min_strength = Math.floor(adventurer.strength / 2);
  const max_strength = adventurer.strength + maxUpside;
  const min_constitution = Math.floor(adventurer.constitution / 2);
  const max_constitution = adventurer.constitution + maxUpside;
  const min_dexterity = Math.floor(adventurer.dexterity / 2);
  const max_dexterity = adventurer.dexterity + maxUpside;
  const sevenDaysInSeconds = 7 * 24 * 60 * 60;
  const sevenDaysAgoTimestamp = Math.round((Date.now() / 1000) - sevenDaysInSeconds);


  const { data } = await axios.post(graphEndpoint, {
    query: `
        query ExmapleQuery{
          adventurers(first: 1000, orderBy: level, orderDirection: asc, where: { 
            charisma_gte: ${min_charisma},
            charisma_lte: ${max_charisma},
            wisdom_gte: ${min_wisdom},
            wisdom_lte: ${max_wisdom},
            intelligence_gte: ${min_intelligence},
            intelligence_lte: ${max_intelligence},
            strength_gte: ${min_strength},
            strength_lte: ${max_strength},
            owner_not: "${adventurer.owner}"
            lastBattledAt_gte: ${sevenDaysAgoTimestamp},
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
  return advs;
}

export async function getOpponents(
  adventurers: AdventurerType[],
): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];
  let opponents = await getAllOpponents(adventurers[0]);
  //openPopup("opponent size " + opponents.length);
  await Promise.all(
    adventurers.map(async adv => {
      const enemies = await getOponent(adv,true, opponents);

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
  winIt: boolean ,
  levelSwitch: number
  ): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];

  let maxAdvantageTraits = 0;
  let maxUpside = 1;

  let remainingAdventurers = [...adventurers];
  let opponents = await getAllOpponents(adventurers[0]);
  //openPopup("opponent size " + opponents.length);


    await Promise.all(
      remainingAdventurers.map(async adv => {
        
        const enemies = await getOponent(adv, winIt, opponents, levelSwitch);

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
function compareAdventurers(advA: AdventurerType, advB: AdventurerType, reference: AdventurerType, winIt: boolean): number {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  let scoreB = 0;
  let losingPreference = 5;

  categories.forEach((category: keyof AdventurerType) => {
    const diffA = advA[category] as number -( reference[category] as number);
    const diffB = advB[category]  as number - (reference[category] as number);

    if (diffA > 0) {
      scoreA += Math.pow((1 / diffA),2) * losingPreference; // Reward for being stronger with smaller difference
    } else {
      scoreA -= Math.pow(diffA/(reference[category] as number),2); // Reward for being weaker with larger difference
    }

    if (diffB > 0) {
      scoreB += Math.pow((1 / diffB),2) * losingPreference; // Reward for being stronger with smaller difference
    } else {
      scoreB -= Math.pow(diffB/(reference[category] as number),2); // Reward for being weaker with larger difference

    }
  });

  return scoreA > scoreB ? -1 : 1;
}
function compareAdventurersLootboxes(advA: AdventurerType, advB: AdventurerType, reference: AdventurerType, strengthFactor: number): number {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  let scoreB = 0;
  let losingPreference = 3;

  categories.forEach(category => {
    const ratioA = (advA[category] as number) /( reference[category] as number);
    const ratioB = (advB[category] as number) /( reference[category] as number);

    scoreA += calculateScore(ratioA, losingPreference, strengthFactor);
    scoreB += calculateScore(ratioB, losingPreference, strengthFactor);
  });

  return scoreA > scoreB ? -1 : 1;
}
function calculateScore(ratio: number, losingPreference: number, strengthFactor: number): number {
  let score = 0;

  if (ratio >= 0.45 && ratio <= 0.999) {
    score = Math.pow(2 * Math.abs(ratio - 1), 2);
  } else if (ratio > 1.001 && ratio <= strengthFactor) {
    score = (Math.pow((ratio - 1) / (strengthFactor - 1), 2)) * losingPreference;
  } else if (ratio > strengthFactor && ratio <= 20) {
    score = (Math.pow((ratio - 20) / (strengthFactor - 20), 2)) * losingPreference;
  }

  return score;
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

export async function getOpponentsAutoLootboxes(
  adventurers: AdventurerType[],
  levelSwitch: number,
  strengthFactor: number
    ): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];

  let remainingAdventurers = [...adventurers];
  let opponents = await getAllOpponents(adventurers[0]);
  //openPopup("opponent size " + opponents.length);

    await Promise.all(
      remainingAdventurers.map(async adv => {
        const enemies = await getOponentLootboxes(adv, opponents, levelSwitch, strengthFactor);

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
async function getAllOpponents(adventurer: AdventurerType) {
  const sevenDaysInSeconds = 7 * 24 * 60 * 60;
  const sevenDaysAgoTimestamp = Math.round((Date.now() / 1000) - sevenDaysInSeconds);

  let adventurers: AdventurerType[] = [];
  let size: number = 1000;
  let nextTokenId: number = 0;
  while ( size == 1000) {
  const { data } = await axios.post(graphEndpoint, {
    query: `
        query ExmapleQuery{
          adventurers(first: 1000, orderBy: tokenId, where: { 
            tokenId_gte: ${nextTokenId}
            lastBattledAt_gte: ${sevenDaysAgoTimestamp}
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
  if (!data.data || data.data.adventurers.length == 0) {
    break;
  }  
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
  adventurers = [...adventurers, ...advs];
  size = advs.length;
  if (size == 1000) nextTokenId = advs[999].tokenId;
  nextTokenId++;
 }
  return adventurers;
}
function openPopup(message: string) {
  const popupWindow = window.open("", "popupWindow", "width=400, height=200");
  (popupWindow as Window).document.write(`<html><head><title>Popup</title></head><body>${message}</body></html>`);
}
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

function getOponent(
  adventurer: AdventurerType,
  opponents: AdventurerType[],
  levelSwitch: number = 13,
  losingPreference: number = 3,
  minValue: number = 1
): AdventurerType[] {
  const advs = opponents;

  return advs
    .filter(enemy => adventurer.level > levelSwitch)
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .filter(enemy => doesHaveSameTraitsOrTooWeak(adventurer, enemy))
    .filter(enemy => scoreHighEnough(enemy, adventurer, losingPreference, minValue))
    .sort((a, b) => compareAdventurers(a, b, adventurer, losingPreference));
}

async function getOponentLootboxes(
  adventurer: AdventurerType,
  opponents: AdventurerType[],
  levelSwitch: number = 13,
  strengthFactor: number = 2.0,
  losingPreference: number = 3,
  minValue: number = 1
): Promise<AdventurerType[]> {
  const advs = opponents;

  return advs
    .filter(enemy => adventurer.level <= levelSwitch)
    .filter(enemy => enemy.tokenId !== adventurer.tokenId)
    .filter(enemy => doesHaveSameTraitsOrTooWeak(adventurer, enemy))
    .filter(enemy => scoreHighEnoughLootboxes(enemy, adventurer, losingPreference, strengthFactor, minValue))
    .sort((a, b) => compareAdventurersLootboxes(a, b, adventurer, strengthFactor));
}

export async function getOpponentsAuto(
  adventurers: AdventurerType[],
  winIt: boolean,
  levelSwitch: number,
  losingPreference: number = 3,
  minValue: number = 1
): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];


  let maxUpside = 1;

  let remainingAdventurers = [...adventurers];
  let opponents = await getAllOpponents(adventurers[0]);


  await Promise.all(
    remainingAdventurers.map(async adv => {

      const enemies = getOponent(adv, opponents, levelSwitch, losingPreference, minValue);

      console.log(enemies);
      enemies.forEach(enemy => {
        if (!map[adv.tokenId] && enemy.tokenId !== adv.tokenId) {
          if (!used.includes(enemy.tokenId)) {
            map[adv.tokenId] = enemy;
            used.push(enemy.tokenId);
          }
        }
      });
      return enemies;
    }));

  return map;
}
function compareAdventurers(advA: AdventurerType, advB: AdventurerType, reference: AdventurerType, losingPreference: number): number {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  let scoreB = 0;

  ({ scoreA, scoreB } = compareAdventurersCalculation(categories, advA, reference, advB, scoreA, losingPreference, scoreB));

  return scoreA > scoreB ? -1 : scoreA < scoreB ? 1 : 0;
}
function compareAdventurersCalculation(categories: (keyof AdventurerType)[], advA: AdventurerType, reference: AdventurerType, advB: AdventurerType, scoreA: number, losingPreference: number, scoreB: number) {
  categories.forEach(category => {
    const diffA = (advA[category] as number) - (reference[category] as number);
    const diffB = (advB[category] as number) - (reference[category] as number);

    scoreA = calculateScore(diffA, scoreA, losingPreference, reference, category);
    scoreB = calculateScore(diffB, scoreB, losingPreference, reference, category);
  });
  return { scoreA, scoreB };
}

function calculateScore(diffA: number, scoreA: number, losingPreference: number, reference: AdventurerType, category: keyof AdventurerType) {
  if (diffA > 0) {
    scoreA += (1 / Math.sqrt(diffA)) * losingPreference;
  }
  else if (diffA <= 0 && diffA >= -Math.ceil((reference[category] as number) / 2)) {
    scoreA -= Math.pow((Math.ceil((reference[category] as number) / 2) + diffA) / Math.ceil((reference[category] as number) / 2), 2);
  }
  else {
    scoreA += -3;
  }

  return scoreA;
}

function compareAdventurersLootboxes(advA: AdventurerType, advB: AdventurerType, reference: AdventurerType, strengthFactor: number): number {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  let scoreB = 0;
  let losingPreference = 3;

  ({ scoreA, scoreB } = compareAdventurersLootboxesCalculation(categories, advA, reference, advB, scoreA, losingPreference, strengthFactor, scoreB));

  return scoreA > scoreB ? -1 : scoreA < scoreB ? 1 : 0;
}
function compareAdventurersLootboxesCalculation(categories: (keyof AdventurerType)[], advA: AdventurerType, reference: AdventurerType, advB: AdventurerType, scoreA: number, losingPreference: number, strengthFactor: number, scoreB: number) {
  categories.forEach(category => {

    const ratioA = (advA[category] as number) / (reference[category] as number);
    const ratioB = (advB[category] as number) / (reference[category] as number);

    scoreA += calculateScoreLootboxes(ratioA, losingPreference, strengthFactor);
    scoreB += calculateScoreLootboxes(ratioB, losingPreference, strengthFactor);
  });
  return { scoreA, scoreB };
}

function calculateScoreLootboxes(ratio: number, losingPreference: number, strengthFactor: number): number {
  let score = 0;
  if (strengthFactor > 1) {
    if (ratio >= 0.45 && ratio <= 0.999) {
      score = Math.pow(2 * Math.abs(ratio - 1), 2);
    } else if (ratio > 1.001 && ratio <= strengthFactor) {
      score = (Math.pow((ratio - 1) / (strengthFactor - 1), 2)) * losingPreference;
    } else if (ratio > strengthFactor && ratio <= 20) {
      score = (Math.pow((ratio - 20) / (strengthFactor - 20), 2)) * losingPreference;
    }
  }
  else if (strengthFactor < 1) {
    //an if statement that returns 1 * losingpreference if ratio is between 0.45 and 0.999 and between 1 and 0 if ratio is between 1 and 2
    if (ratio >= 0.45 && ratio < 1) {
      score = Math.pow(2 * Math.abs(ratio - 1), 2) * losingPreference;
    }
    else if (ratio > 1 && ratio < 1.25) {
      score = (Math.pow((ratio - 1.25) / 0.25, 2))
    }
  }


  return score;
}
function scoreHighEnough(enemy: AdventurerType, adventurer: AdventurerType, losingPreference: number, minValue: number = 4): boolean {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  categories.forEach(category => {
    const diffA = (enemy[category] as number) - (adventurer[category] as number);
    scoreA = calculateScore(diffA, scoreA, losingPreference, adventurer, category);
  });
  return scoreA >= minValue;
}
function scoreHighEnoughLootboxes(enemy: AdventurerType, adventurer: AdventurerType, losingPreference: number, strengthFactor: number, minValue: number = 4): boolean {
  const categories = ['charisma', 'strength', 'intelligence', 'constitution', 'wisdom', 'dexterity'] as (keyof AdventurerType)[];
  let scoreA = 0;
  categories.forEach(category => {
    const ratioA = (enemy[category] as number) / (adventurer[category] as number);
    scoreA += calculateScoreLootboxes(ratioA, losingPreference, strengthFactor);
  });
  return scoreA >= minValue;
}
function doesHaveSameTraitsOrTooWeak(adventurer: AdventurerType, enemy: AdventurerType): boolean {
  let fails = 0;

  if (adventurer.charisma == enemy.charisma) {
    fails++;
  }
  if (adventurer.strength == enemy.strength) {
    fails++;
  }
  if (adventurer.intelligence == enemy.intelligence) {
    fails++;
  }
  if (adventurer.constitution == enemy.constitution) {
    fails++;
  }
  if (adventurer.wisdom == enemy.wisdom) {
    fails++;
  }
  if (adventurer.dexterity == enemy.dexterity) {
    fails++;
  }
  if (Math.floor(adventurer.charisma / 2) > enemy.charisma) {
    fails++;
  }
  if (Math.floor(adventurer.strength / 2) > enemy.strength) {
    fails++;
  }
  if (Math.floor(adventurer.intelligence / 2) > enemy.intelligence) {
    fails++;
  }
  if (Math.floor(adventurer.constitution / 2) > enemy.constitution) {
    fails++;
  }
  if (Math.floor(adventurer.wisdom / 2) > enemy.wisdom) {
    fails++;
  }
  if (Math.floor(adventurer.dexterity / 2) > enemy.dexterity) {
    fails++;
  }
  return fails == 0;
}

export async function getOpponentsAutoLootboxes(
  adventurers: AdventurerType[],
  levelSwitch: number,
  strengthFactor: number,
  losingPreference: number = 3,
  minValue: number = 1
): Promise<{ [key: number]: AdventurerType }> {
  const map: { [key: number]: AdventurerType } = {};
  const used: number[] = [];


  let remainingAdventurers = [...adventurers];
  let opponents = await getAllOpponents(adventurers[0]);
  //openPopup("opponent size " + opponents.length);

  await Promise.all(
    remainingAdventurers.map(async adv => {
      const enemies = await getOponentLootboxes(adv, opponents, levelSwitch, strengthFactor, losingPreference, minValue);

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
  while (size == 1000) {
    const { data } = await axios.post(graphEndpoint, {
      query: `
        query ExmapleQuery{
          adventurers(first: 1000, orderBy: tokenId, where: { 
            tokenId_gte: ${nextTokenId},
            owner_not: "${adventurer.owner}",
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
function openPopup(message: any) {
  const messages = message.split('\n'); // Split the message string into individual messages
  const formattedMessage = messages.join('<br>'); // Join the messages back together, adding a <br> after each one
  const popupWindow = window.open("", "popupWindow", "width=400, height=200");
  if (popupWindow && popupWindow.document) {
    popupWindow.document.write(`<html><head><title>Popup</title></head><body>${formattedMessage}</body></html>`);
  } else {
    // Handle the case where the popup couldn't be opened
    console.error("Could not open popup window. Please ensure popups are allowed for this website.");
  }
}
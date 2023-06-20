import { getRealms } from '../api/getRealms';
export function fillCollectiblesReactor(_realmIds: any[], _collectibleIds: number[][], _quantities: number[][]) {
  //https://ipfs.io/ipfs/QmaMxbq2wWQNERcCPHKKuKqwfkaxDDbAPAj4J1f1AjCbpc/

  const lionsManeJellyfishId = 15;
  const graniteId = 30;
  const elderwoodId = 36;
  const meteoriteId = 38;
  const obsidianId = 39;
  const wineId = 9;
  const nanotechnologyId = 26;
  const artificialIntelligenceId = 29;
  const giantSquidId = 19;

  const qtyTwelf = 12;
  const qtySix = 6;
  const qtyFour= 4;
  const qtyThree = 3;

  const data = [
    { realmId: 42, collectibleId: graniteId, quantity: qtyTwelf },
    { realmId: 190, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 191, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 199, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 541, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 677, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 694, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1000, collectibleId: graniteId, quantity: qtyFour },
    { realmId: 1420, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1518, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1524, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1525, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1530, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1535, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1543, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1622, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1800, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 1815, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 1968, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 2359, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 2477, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 2541, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 2606, collectibleId: artificialIntelligenceId, quantity: qtyThree },
    { realmId: 2788, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 2816, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 3000, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 3392, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 3707, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 4118, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 4269, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 4327, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 4328, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 4552, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 4763, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 4800, collectibleId: meteoriteId, quantity: qtyFour },
    { realmId: 12058, collectibleId: obsidianId, quantity: qtyThree }
  ];

  data.forEach(({ realmId, collectibleId, quantity }) => {
    _realmIds.push(realmId);
    _collectibleIds.push([collectibleId]);
    _quantities.push([quantity]);
  });

}

export function fillCollectiblesRealm(_realmIds: any[], _collectibleIds: number[][], _quantities: number[][]) {
  //https://ipfs.io/ipfs/QmaMxbq2wWQNERcCPHKKuKqwfkaxDDbAPAj4J1f1AjCbpc/

  const lionsManeJellyfishId = 15;
  const graniteId = 30;
  const elderwoodId = 36;
  const meteoriteId = 38;
  const obsidianId = 39;
  const wineId = 9;
  const nanotechnologyId = 26;
  const artificialIntelligenceId = 29;
  const giantSquidId = 19;

  const qtySix = 6;
  const qtyFour = 4;
  const qtyTwo = 2;

  const data = [
    { realmId: 1399, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1519, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1546, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1550, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1551, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1552, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1553, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1554, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1555, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1562, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1566, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1567, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1571, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1572, collectibleId: graniteId, quantity: qtySix },
    { realmId: 1575, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 1839, collectibleId: graniteId, quantity: qtySix },
    { realmId: 2159, collectibleId: graniteId, quantity: qtySix },
    { realmId: 2423, collectibleId: graniteId, quantity: qtySix },
    { realmId: 2543, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 2572, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 2878, collectibleId: graniteId, quantity: qtySix },
    { realmId: 3105, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 3549, collectibleId: graniteId, quantity: qtySix },
    { realmId: 4444, collectibleId: graniteId, quantity: qtySix },
    { realmId: 4646, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 4658, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 4734, collectibleId: graniteId, quantity: qtySix },
    { realmId: 4738, collectibleId: graniteId, quantity: qtySix },
    { realmId: 4930, collectibleId: meteoriteId, quantity: qtyTwo },
    { realmId: 5000, collectibleId: graniteId, quantity: qtySix }
  ];

  data.forEach(({ realmId, collectibleId, quantity }) => {
    _realmIds.push(realmId);
    _collectibleIds.push([collectibleId]);
    _quantities.push([quantity]);
  });

}

// export async function fillCollectiblesReactorAuto(address: string, _realmIds: any[], _collectibleIds: number[][], _quantities: number[][]) {
//   const realmsWithReactors = await getRealms(address.toLowerCase(), true);

//   const meteoriteId = 38;
//   const graniteId = 30;

//   const qtyTwelf = 12;
//   const qtyFour = 4;

//   const typeMap: { [key: string]: string } = {
//     Prairie: 'Nourishment', River: 'Nourishment', Biosphere: 'Nourishment', Pond: 'Nourishment', 
//     Canal: 'Nourishment', Lagoon: 'Nourishment', Oasis: 'Nourishment', Waterfall: 'Nourishment', 
//     Sea: 'Aquatic', Lake: 'Aquatic', Fjord: 'Aquatic', Cove: 'Aquatic', Gulf: 'Aquatic', 
//     Bay: 'Aquatic', Reef: 'Aquatic',
//     Desert: 'Technological', Cave: 'Technological', Cape: 'Technological', 
//     Peninsula: 'Technological', Swamp: 'Technological', Dune: 'Technological', Island: 'Technological', 
//     Geyser: 'Technological',
//     Basin: 'Earthen', Plateau: 'Earthen', Mesa: 'Earthen', IceShelf: 'Earthen', 
//     Glacier: 'Earthen', Butte: 'Earthen', Canyon: 'Earthen', Mountain: 'Earthen',
//     Valley: 'NourishmentExotic', Ocean: 'AquaticExotic', Tundra: 'TechnologicalExotic', 
//     Volcano: 'EarthenExotic'
//   };

//   const chosenType = promptUser(Object.values(typeMap)); // Prompt user for choosing the type

//   realmsWithReactors.forEach((realm: any) => {
//     const types = [realm.feature1, realm.feature2, realm.feature3].map((feature: string) => typeMap[feature]);

//     if (types.includes(chosenType)) {
//       _realmIds.push(realm.id);
//       _collectibleIds.push([meteoriteId]);
//       _quantities.push([qtyFour]);
//     } else {
//       _realmIds.push(realm.id);
//       _collectibleIds.push([graniteId]);
//       _quantities.push([qtyTwelf]);
//     }
//   });
// }

// // Function to prompt the user for choosing the type
// function promptUser(typeList: string[]): string {
//   // Use your preferred way of prompting the user for a choice, this is just a placeholder
//   let chosenType = "";
//   do {
//     chosenType = prompt(`Please choose a type: ${Array.from(new Set(typeList)).join(', ')}`);
//   } while (!typeList.includes(chosenType));

//   return chosenType;
// }

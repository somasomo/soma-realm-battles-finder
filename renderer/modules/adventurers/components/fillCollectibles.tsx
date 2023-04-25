export function fillCollectiblesReactor(_realmIds: any[], _collectibleIds: number[][], _quantities: number[][]) {
  //https://ipfs.io/ipfs/QmaMxbq2wWQNERcCPHKKuKqwfkaxDDbAPAj4J1f1AjCbpc/

  const lionsManeJellyfishId = 15;
  const elderwoodId = 36;
  const obsidianId = 39;
  const wineId = 9;
  const nanotechnologyId = 26;
  const artificialIntelligenceId = 29;
  const giantSquidId = 19;

  const qtySix = 6;
  const qtyThree = 3;

  const data = [
    { realmId: 42, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 190, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 191, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 199, collectibleId: wineId, quantity: qtyThree },
    { realmId: 1000, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 1420, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 1518, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1519, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 1524, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1525, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1530, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1535, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1543, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1622, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 1800, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 1839, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 1968, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 2423, collectibleId: nanotechnologyId, quantity: qtySix },
    { realmId: 2541, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 2606, collectibleId: artificialIntelligenceId, quantity: qtyThree },
    { realmId: 2816, collectibleId: artificialIntelligenceId, quantity: qtyThree },
    { realmId: 3000, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 3392, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 3549, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 3707, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 4118, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 4269, collectibleId: elderwoodId, quantity: qtySix },
    { realmId: 4327, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 4328, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 4444, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 4552, collectibleId: obsidianId, quantity: qtyThree },
    { realmId: 4738, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 4763, collectibleId: giantSquidId, quantity: qtyThree },
    { realmId: 4800, collectibleId: lionsManeJellyfishId, quantity: qtySix },
    { realmId: 5000, collectibleId: giantSquidId, quantity: qtyThree },
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
  const elderwoodId = 36;
  const obsidianId = 39;
  const wineId = 9;
  const nanotechnologyId = 26;
  const artificialIntelligenceId = 29;
  const giantSquidId = 19;

  const qtyFour = 4;
  const qtyTwo = 2;

  const data = [
    //{ realmId: 1399, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1546, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1550, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1551, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1552, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1553, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1554, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1555, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1562, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1566, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1567, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1571, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 1572, collectibleId: nanotechnologyId, quantity: qtyFour },
    { realmId: 1575, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 1815, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 2159, collectibleId: nanotechnologyId, quantity: qtyFour },
    { realmId: 2359, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 2543, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 2572, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 2788, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 2878, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 3105, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 4646, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 4658, collectibleId: elderwoodId, quantity: qtyFour },
    { realmId: 4734, collectibleId: lionsManeJellyfishId, quantity: qtyFour },
    { realmId: 4930, collectibleId: elderwoodId, quantity: qtyFour }
  ];

  data.forEach(({ realmId, collectibleId, quantity }) => {
    _realmIds.push(realmId);
    _collectibleIds.push([collectibleId]);
    _quantities.push([quantity]);
  });

}

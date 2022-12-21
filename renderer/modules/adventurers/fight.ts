import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';

import wl from './wl';

function generateMerkle(whiteList: string[]): MerkleTree {
  const leafNodes = whiteList.map(add => keccak256(add));

  const merkletree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  return merkletree;
}

export function getProof(address: string) {
  const merkle = generateMerkle(['0x747910B74D2651A06563C3182838EAE4120F4277']);
  const hexProof = merkle.getHexProof(keccak256(address));
  return hexProof;
}

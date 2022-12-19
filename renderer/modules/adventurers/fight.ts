import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";

import wl from './wl'

function generateMerkle(whiteList: string[]): MerkleTree {
    const leafNodes = whiteList.map((add) => keccak256(add));
  
    const merkletree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
  
    return merkletree;
  }

  export function getProof(address: string) {
    const merkle = generateMerkle(wl);
    const hexProof = merkle.getHexProof(keccak256(address))
    return hexProof
  }
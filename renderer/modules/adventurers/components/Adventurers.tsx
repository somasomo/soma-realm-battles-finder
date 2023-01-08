import { useEffect, useMemo, useState } from 'react';
import { getAdventurers } from '../api/getAdventurers';
import { getOponents } from '../api/getOponents';
import { AdventurerType } from '../types/adventurer';
import { Adventurer } from './Adventurer';
import abi from '../fight.abi.json';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { getProof } from '../fight';
import { BigNumber } from 'ethers';
export default function Adventurers({ address }: { address: string }) {
  const [adventurers, setAdventurers] = useState<AdventurerType[]>([]);
  const [maxDownside, setMaxDownside] = useState(20);
  const [maxUpside, setMaxUpside] = useState(0);
  const [oponents, setOponents] = useState<any>([]);

  const [fighting, setFighting] = useState<number[]>([]);
  useEffect(() => {
    const fetchADV = async () => {
      const adv = await getAdventurers(address);
      setAdventurers(adv);
    };
    fetchADV();
  }, [address]);

  const fetchOponents = async () => {
    const op = await getOponents(adventurers, maxDownside, maxUpside);

    setOponents(op);
  };

  const { config } = usePrepareContractWrite({
    args: [adventurers.map(i => i.owner), adventurers.map(i => i.tokenId), [], [], [], []]
  });

  const { data, writeAsync, error, isError, isLoading } = useContractWrite({
    address: '0xa015db2a753dc54a9702b895489747558e9764a6',
    abi: abi,
    functionName: 'fight',
    mode: 'recklesslyUnprepared',
    overrides: {
      gasLimit: BigNumber.from(9000000)
    }
  });

  const fight = async () => {
    if (writeAsync) {
      const ownerAddresses: string[] = [];
      const tokenIds: number[] = [];
      const proofs: string[][] = [];
      const oppAddresses: string[] = [];
      const oppIds: number[] = [];
      const oppProofs: string[][] = [];
      console.log(oponents);
      Object.keys(oponents).forEach(tokenId => {
        const op = oponents[tokenId];
        const adv = adventurers
          .filter(i => fighting.includes(i.tokenId))
          .find(i => i.tokenId === (tokenId as any));

        if (adv) {
          proofs.push(getProof(adv.owner));
          //proofs.push([])
          ownerAddresses.push('0x747910B74D2651A06563C3182838EAE4120F4277');
          tokenIds.push(parseInt(adv.tokenId as any, 10));
          oppAddresses.push('0x747910B74D2651A06563C3182838EAE4120F4277');
          oppIds.push(parseInt(op.tokenId, 10));
          oppProofs.push(getProof(op.owner));
          //oppProofs.push([])
        }
      });

      console.log('eee', [ownerAddresses, tokenIds, proofs, oppAddresses, oppIds, oppProofs]);

      try {
        await writeAsync({
          recklesslySetUnpreparedArgs: [ownerAddresses, tokenIds, proofs, oppAddresses, oppIds, oppProofs]
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
      <h2>My adventurers</h2>
      <div className="wrapper">
        {adventurers &&
          adventurers.map((adv, index) => {
            return (
              <div
                className={`adventurer ${fighting.includes(adv.tokenId) ? 'active' : ''}`}
                key={`adventurer-${index}`}
                onClick={() => {
                  if (fighting.includes(adv.tokenId)) {
                    setFighting(fighting.filter(i => i !== adv.tokenId));
                  } else {
                    setFighting([...fighting, adv.tokenId]);
                  }
                }}
              >
                <div>
                  <h3>Adventurer</h3>
                  <Adventurer adventurer={adv} />
                </div>
                {oponents[adv.tokenId] && (
                  <div>
                    <h3>OPONENT</h3>
                    <Adventurer adventurer={oponents[adv.tokenId]} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="actions">
        <button onClick={fetchOponents}>Find opponents</button>
        {Object.keys(oponents).length > 0 && fighting.length > 0 && (
          <button onClick={fight}>
            {isLoading ? 'Loading...' : `Fight with ${fighting.length} adventurers`}
          </button>
        )}
        {fighting.length === 0 && <div>Select some adventurers first</div>}
        {error && JSON.stringify(error, null, 2)}
        {isError && <div>Error on the transaction</div>}

        <h3>Max difference down</h3>
        <input
          type="number"
          value={maxDownside}
          onChange={e => {
            setMaxDownside(parseInt(e.target.value));
          }}
        />

        <h3>Max difference up</h3>
        <input
          type="number"
          value={maxUpside}
          onChange={e => {
            setMaxUpside(parseInt(e.target.value));
          }}
        />
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-wrap: wrap;
        }

        .adventurer {
          margin: 10px;
          display: flex;
          cursor: pointer;
        }

        .adventurer.active {
          border: 1px solid yellow;
          background: #c3c356;
        }
      `}</style>
    </div>
  );
}

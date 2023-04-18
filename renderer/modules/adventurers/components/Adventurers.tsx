import { useEffect, useMemo, useState } from 'react';
import { getAdventurers } from '../api/getAdventurers';
import { getOponents } from '../api/getOponents';
import { AdventurerType } from '../types/adventurer';
import { Adventurer } from './Adventurer';
import abi from '../fight.abi.json';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { getProof } from '../fight';
import { BigNumber } from 'ethers';
import { Button } from '@/modules/layout/components/Button';
export default function Adventurers({ address }: { address: string }) {
  const [adventurers, setAdventurers] = useState<AdventurerType[]>([]);
  const [maxAdvantageTraits, setMaxAdvantageTraits] = useState(1);
  const [maxUpside, setMaxUpside] = useState(0);
  const [oponents, setOponents] = useState<any>([]);

  const [fighting, setFighting] = useState<number[]>([]);

  const selectAll = () => {
    setFighting(adventurers.map(i => i.tokenId));
  };

  const selectNone = () => {
    setFighting([]);
  };

  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);

  const selectX = () => {

    setFighting(adventurers.slice(start === 0 ? 0 : start - 1, end).map(i => i.tokenId));
  };

  useEffect(() => {
    const fetchADV = async () => {
      const adv = await getAdventurers(address);
      setAdventurers(adv);
      setEnd(adv.length > 100 ? 50 : adv.length)
    };
    fetchADV();
  }, [address]);

  const fetchOponents = async () => {
    const op = await getOponents(adventurers, maxAdvantageTraits, maxUpside);

    setOponents(op);
  };

  const { config } = usePrepareContractWrite({
    args: [adventurers.map(i => i.owner), adventurers.map(i => i.tokenId), [], [], [], []]
  });

  const { data, writeAsync, error, isError, isLoading } = useContractWrite({
    address: '0x4eb66cbf70677a0e31c633d39752e98e151ac022',
    abi: abi,
    functionName: 'fight',
    mode: 'recklesslyUnprepared',
    overrides: {
      gasLimit: BigNumber.from(fighting.length * 600000).gt(5000000) ? BigNumber.from(fighting.length * 600000) : BigNumber.from(5000000)
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
                  <h3>Adventurer {index+1} - (#{adv.tokenId}) </h3>
                  <Adventurer adventurer={adv} oponent={oponents[adv.tokenId]} />
                </div>
                {oponents[adv.tokenId] && (
                  <div>
                    <h3>OPONENT</h3>
                    <Adventurer adventurer={oponents[adv.tokenId]} oponent={adv} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="actions">
        <div style={{ margin: '10px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '15px',
              border: '1px solid black',
              marginBottom: '10px'
            }}
          >
            <div>
              <label>
                Maximum Traits with Advantage (The maximum amount of traits where the Adventurer may hava an advantage)
              </label>
              <input
                type="number"
                value={maxAdvantageTraits}
                onChange={e => {
                  setMaxAdvantageTraits(parseInt(e.target.value));
                }}
              />
            </div>
            <div>
              <label>Maximum Trait Upside (The difference in power to the upside)</label>
              <input
                type="number"
                value={maxUpside}
                onChange={e => {
                  setMaxUpside(parseInt(e.target.value));
                }}
              />
            </div>
          </div>

          <Button onClick={fetchOponents}>Find opponents</Button>
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <Button onClick={selectAll}>Select all</Button>
        <Button onClick={selectNone}>Select none</Button>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Button onClick={selectX}>Select {end + 1 - start} (From {start} to {end})</Button>
        <input type="number" value={start} onChange={e => setStart(parseInt(e.target.value))} />
        <input type="number" value={end} onChange={e => setEnd(parseInt(e.target.value))} />
        </div>
      </div>

      {Object.keys(oponents).length > 0 && fighting.length > 0 && (
        <div style={{ margin: '10px' }}>
          <Button primary onClick={fight}>
            {isLoading ? 'Loading...' : `Fight with ${fighting.length} adventurers`}
          </Button>
        </div>
      )}
      {fighting.length === 0 && <div>Select some adventurers first</div>}
      {error && JSON.stringify(error, null, 2)}
      {isError && <div>Error on the transaction</div>}

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-wrap: wrap;
        }

        .adventurer {
          margin: 10px;
          display: flex;
          cursor: pointer;
          padding: 15px;
        }

        .adventurer.active {
          border: 1px solid yellow;
          background: #c3c356;
        }
      `}</style>
    </div>
  );
}

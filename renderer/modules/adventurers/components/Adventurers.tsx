import { useEffect, useMemo, useState } from 'react';
import { getAdventurers } from '../api/getAdventurers';
import { getOponents } from '../api/getOponents';
import { AdventurerType } from '../types/adventurer';
import { Adventurer } from './Adventurer';

export default function Adventurers({ address }: { address: string }) {
  const [adventurers, setAdventurers] = useState<AdventurerType[]>([]);
  const [maxDownside, setMaxDownside] = useState(20);
  const [maxUpside, setMaxUpside] = useState(0);
  const [oponents, setOponents] = useState<any>([]);
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

  return (
    <div>
      <h2>My adventurers</h2>
      <div className="wrapper">
        {adventurers &&
          adventurers.map((adv, index) => {
            return (
              <div className="adventurer" key={`adventurer-${index}`}>
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
        }
      `}</style>
    </div>
  );
}

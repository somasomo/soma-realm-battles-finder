import { useEffect, useMemo, useState } from 'react';
import { getAdventurers } from '../api/getAdventurers';
import { getOpponents } from '../api/getOponents';
import { getOpponentsAuto } from '../api/getOponents';
import { AdventurerType } from '../types/adventurer';
import { Adventurer } from './Adventurer';
import abi from '../fight.abi.json';
import trainabi from '../train.abi.json';
import collectabi from '../collect.abi.json';
import collectRealmabi from '../collectRealm.abi.json';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { getProof } from '../fight';
import { BigNumber } from 'ethers';
import { Button } from '@/modules/layout/components/Button';
import { fillCollectiblesReactor } from './fillCollectibles';
import { fillCollectiblesRealm } from './fillCollectibles';
export default function Adventurers({ address }: { address: string }) {
  const [adventurers, setAdventurers] = useState<AdventurerType[]>([]);
  const [maxAdvantageTraits, setMaxAdvantageTraits] = useState(1);
  const [maxUpside, setMaxUpside] = useState(0);
  const [oponents, setOponents] = useState<any>([]);
  const skillLabels = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

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
    const op = await getOpponents(adventurers, maxAdvantageTraits, maxUpside);

    setOponents(op);
  };
  const fetchOponentsAuto = async () => {
    const op = await getOpponentsAuto(adventurers, false);

    setOponents(op);
  };

  const fetchOponentsAutoWin = async () => {
    const op = await getOpponentsAuto(adventurers, true);

    setOponents(op);
  };

  const { config } = usePrepareContractWrite({
    args: [adventurers.map(i => i.owner), adventurers.map(i => i.tokenId), [], [], [], []]
  });

  const { data, writeAsync, error, isError, isLoading } = useContractWrite({
    address: '0xcfcd2371f19b31f9500f4581ac52ffbfaabbb18e',
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


  function openPopup(message) {
    const popupWindow = window.open("", "popupWindow", "width=400, height=200");
    popupWindow.document.write(`<html><head><title>Popup</title></head><body>${message}</body></html>`);
  }

  const {
    data: collectData,
    writeAsync: collectWriteAsync,
    error: collectError,
    isError: collectIsError,
    isLoading: collectIsLoading,
  } = useContractWrite({
    address: '0x0fd948feCD2763792EB2f898CF800d0Ec2C09105',
    abi: collectabi,
    functionName: 'collect',
    mode: 'recklesslyUnprepared',
  });

  const collectReactor = async () => {
    // Set your required values here
    const _realmIds: any[] = []; // uint256[]
    const _collectibleIds: number[][] = []; // uint256[][]
    const _quantities: number[][] = []; // uint256[][]
    fillCollectiblesReactor(_realmIds, _collectibleIds, _quantities);


    if (collectWriteAsync) {
      try {
        await collectWriteAsync({
          recklesslySetUnpreparedArgs: [
            _realmIds,
            _collectibleIds,
            _quantities,
          ],
        });
      } catch (e) {
        openPopup("collectWriteAsync failed" + [_realmIds, _collectibleIds.length, _collectibleIds[0].length, _quantities.length, , _collectibleIds[0], , _collectibleIds[1], , _collectibleIds[2]]);
      }
    }
  };

  const {
    data: collectRealmData,
    writeAsync: collectRealmWriteAsync,
    error: collectRealmError,
    isError: collectRealmIsError,
    isLoading: collectRealmIsLoading,
  } = useContractWrite({
    address: '0xC0aB359035F2a3A6181E963d4dd6d4746Bc22cc2',
    abi: collectRealmabi,
    functionName: 'collect',
    mode: 'recklesslyUnprepared',
  });

  const collectRealm = async () => {
    // Set your required values here
    const _realmIds: any[] = []; // uint256[]
    const _collectibleIds: number[][] = []; // uint256[][]
    const _quantities: number[][] = []; // uint256[][]
    fillCollectiblesRealm(_realmIds, _collectibleIds, _quantities);


    if (collectRealmWriteAsync) {
      try {
        await collectRealmWriteAsync({
          recklesslySetUnpreparedArgs: [
            _realmIds,
            _collectibleIds,
            _quantities,
          ],
        });
      } catch (e) {
        openPopup("collectRealmWriteAsync failed" + [_realmIds, _collectibleIds.length, _collectibleIds[0].length, _quantities.length, , _collectibleIds[0], , _collectibleIds[1], , _collectibleIds[2]]);
      }
    }
  };

  const {
    data: trainData,
    writeAsync: trainWriteAsync,
    error: trainError,
    isError: trainIsError,
    isLoading: trainIsLoading,
  } = useContractWrite({
    address: '0x7c9b4ab180Ac02cC3edD0916Af6502D719143125',
    abi: trainabi,
    functionName: 'train',
    mode: 'recklesslyUnprepared',
  });

  const [skills, setSkills] = useState(Array(6).fill(0));

  const handleSkillInput = (e, index) => {
    const value = parseInt(e.target.value);
    const sum = skills.reduce((a, b) => a + b, 0) - skills[index] + value;
    if (sum <= 6) {
      const newSkills = [...skills];
      newSkills[index] = value;
      setSkills(newSkills);
    }
  };

  const trainMischief = async () => {
    console.log("Training Mischief with skills:", skills);
    trainThisKlass(2);
  };

  const trainChaos = () => {
    console.log("Training Chaos with skills:", skills);
    trainThisKlass(1);
  };

  const trainTranquility = () => {
    console.log("Training Tranquility with skills:", skills);
    trainThisKlass(3);
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 50, left: 0, margin: '10px' }}>
        <Button onClick={collectReactor}>Collect reactor production</Button>
        <Button onClick={collectRealm}>Collect realm production</Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Training</h3>
        <div>
          {Array(6).fill(null).map((_, i) => (
            <div key={`skill-input-${i}`} style={{ display: "inline-block", marginRight: "10px" }}>
              <label>{skillLabels[i]}</label>
              <input
                key={`skill-${i}`}
                type="number"
                min="0"
                max="6"
                value={skills[i]}
                onChange={e => handleSkillInput(e, i)}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button onClick={trainMischief}>Train Mischief</Button>
          <Button onClick={trainChaos}>Train Chaos</Button>
          <Button onClick={trainTranquility}>Train Tranquility</Button>
        </div>
      </div>
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
                  <h3>Adventurer {index + 1} - (#{adv.tokenId}) </h3>
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
                Maximum Traits with Advantage
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
          <Button onClick={fetchOponentsAuto}>Automatically Optimize to Lose</Button>
          {/* <Button onClick={fetchOponentsAutoWin}>Automatically Optimize to Win</Button> */}
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

  async function trainThisKlass(
    klass: number,
  ) {
    const ownerAddresses: string[] = [];
    const adventurerIds: number[] = [];
    const proofs: string[][] = [];
    const traitIds: number[][] = [];
    const traitAmounts: number[][] = [];

    const getTraitIds = () => [2, 3, 4, 5, 6, 7];

    adventurers.forEach(adv => {
      if (adv.klass === klass) {
        proofs.push([]);
        ownerAddresses.push('0x747910B74D2651A06563C3182838EAE4120F4277');
        adventurerIds.push(parseInt(adv.tokenId as any, 10));
        traitIds.push(getTraitIds());
        traitAmounts.push(skills);
      }
    });

    if (trainWriteAsync) {
      try {
        await trainWriteAsync({
          recklesslySetUnpreparedArgs: [
            ownerAddresses,
            adventurerIds,
            proofs,
            traitIds,
            traitAmounts,
          ],
        });
      } catch (e) {
        openPopup("trainWriteAsync failed" + [adventurers.length, ownerAddresses.length, adventurerIds, trainIsError, trainError]);
      }
    }
  }
}


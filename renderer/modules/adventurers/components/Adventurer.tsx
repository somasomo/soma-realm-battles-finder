import Image from 'next/image';
import { AdventurerType } from '../types/adventurer';

export function Adventurer({ adventurer, oponent }: { adventurer: AdventurerType, oponent?: AdventurerType }) {
  return (
    <div>
      <div className="wrapper">
        <Image
          src={`https://app.rlm.land/assets/adventurers/${adventurer.archetype}.jpeg`}
          width={150}
          height={150}
          alt="Adventurer"
        />
        <div className="trait">
          <div className="trait-text">tokenId</div>
          <div className={`trait-value `}>{adventurer.tokenId}</div>
        </div>
        <div className="trait">
          <div className="trait-text">Level</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.level > adventurer.level ? 'lower': oponent.level === adventurer.level ? 'equal': 'greater'}`}>{adventurer.level}</div>
        </div>
        <div className="trait">
          <div className="trait-text">charisma</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.charisma > adventurer.charisma ? 'lower': oponent.charisma === adventurer.charisma ? 'equal': 'greater'}`}>{adventurer.charisma}</div>
        </div>
        <div className="trait">
          <div className="trait-text">wisdom</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.wisdom > adventurer.wisdom ? 'lower': oponent.wisdom === adventurer.wisdom ? 'equal': 'greater'}`}>{adventurer.wisdom}</div>
        </div>
        <div className="trait">
          <div className="trait-text">constitution</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.constitution > adventurer.constitution ? 'lower': oponent.constitution === adventurer.constitution ? 'equal': 'greater'}`}>{adventurer.constitution}</div>
        </div>
        <div className="trait">
          <div className="trait-text">strength</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.strength > adventurer.strength ? 'lower': oponent.strength === adventurer.strength ? 'equal': 'greater'}`}>{adventurer.strength}</div>
        </div>
        <div className="trait">
          <div className="trait-text">dexterity</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.dexterity > adventurer.dexterity ? 'lower': oponent.dexterity === adventurer.dexterity ? 'equal': 'greater'}`}>{adventurer.dexterity}</div>
        </div>
        <div className="trait">
          <div className="trait-text">intelligence</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.intelligence > adventurer.intelligence ? 'lower': oponent.intelligence === adventurer.intelligence ? 'equal': 'greater'}`}>{adventurer.intelligence}</div>
        </div>
        <div className="trait">
          <div className="trait-text">battles</div>
          <div className={`trait-value ${!oponent ? 'empty': oponent.battles > adventurer.battles ? 'lower': oponent.battles === adventurer.battles ? 'equal': 'greater'}`}>{adventurer.battles}</div>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          border: 1px solid;
          padding: 10px;
        }
        .trait {
          display: flex;
          justify-content: space-between;
          margin: 5px;
        }

        .lower {
          color: red;
        }

        .greater {
          color: green;
        }
      `}</style>
    </div>
  );
}

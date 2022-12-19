import { AdventurerType } from "../types/adventurer"

export function Adventurer({adventurer}: {
    adventurer: AdventurerType
}) {
    return <div>
        <div className="wrapper">
        <div className="trait">
                <div className="trait-text">tokenId</div>
                <div className="trait-value">{adventurer.tokenId}</div>
            </div>
            <div className="trait">
                <div className="trait-text">Level</div>
                <div className="trait-value">{adventurer.level}</div>
            </div>
            <div className="trait">
                <div className="trait-text">charisma</div>
                <div className="trait-value">{adventurer.charisma}</div>
            </div>
            <div className="trait">
                <div className="trait-text">wisdom</div>
                <div className="trait-value">{adventurer.wisdom}</div>
            </div>
            <div className="trait">
                <div className="trait-text">constitution</div>
                <div className="trait-value">{adventurer.constitution}</div>
            </div>
            <div className="trait">
                <div className="trait-text">strength</div>
                <div className="trait-value">{adventurer.strength}</div>
            </div>
            <div className="trait">
                <div className="trait-text">dexterity</div>
                <div className="trait-value">{adventurer.dexterity}</div>
            </div>
            <div className="trait">
                <div className="trait-text">intelligence</div>
                <div className="trait-value">{adventurer.intelligence}</div>
            </div>
            <div className="trait">
                <div className="trait-text">battles</div>
                <div className="trait-value">{adventurer.battles}</div>
            </div>
        </div>
        <style jsx>{
            `
            .wrapper {
                border: 1px solid;
                padding: 10px;
            }
            .trait {
                display: flex;
                justify-content: space-between;
                margin: 5px;
            }
            `
        }</style>
    </div>
}
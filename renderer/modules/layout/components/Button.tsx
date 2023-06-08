import React from 'react';

export function Button({children, onClick, primary}: {children: React.ReactNode, onClick: () => void, primary?: boolean}) {
    return (
        <>
            <button className={`${primary ? 'primary': ''}`} onClick={onClick}>{children}</button>
            <style jsx>{`
                button {
                    padding: 15px;
                    background: white;
                    border: 1px solid black;
                    color: black;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                }

                button.primary {
                    background: black;
                    color: white;
                }
            `}</style>
        </>
    )
}
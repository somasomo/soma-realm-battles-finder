import Link from 'next/link';

export function Footer() {
  return (
    <div>
      <div className="footer">
        
      </div>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        2022 - Realm Oponents
      </div>
      <style jsx>
        {`
          .footer {
            padding: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            max-width: 1500px;
            margin: 0 auto;
            margin-top: 30px;
          }

          .footer a {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            color: white;
            text-transform: uppercase;
            text-decoration: underline;
          }

          .link {
            padding: 30px;
          }
        `}
      </style>
    </div>
  );
}

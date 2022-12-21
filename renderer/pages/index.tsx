import Adventurers from '@/modules/adventurers/components/Adventurers';
import DaiBalance from '@/modules/dai/components/DaiBalanceDisplay';
import { Layout } from '@/modules/layout/components/Layout';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
  const { address } = useAccount();
  const [show, setShow] = useState(false);
  // Prevent server-side problem with different UI
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Layout>
      <main>
        <div className="page-content">
          <div className="title">
            <h1>Realm Battles</h1>
          </div>

          {show && address && <Adventurers address={address} />}
        </div>
      </main>
      <style jsx>{`
        .title {
          text-align: center;
          margin-bottom: 60px;
          padding: 15px;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .balances {
          margin-top: 60px;
        }
      `}</style>
    </Layout>
  );
}

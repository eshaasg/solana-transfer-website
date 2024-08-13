'use client'
import { setTransferFeeInstructionData } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, SystemProgram, PublicKey, Transaction} from '@solana/web3.js';
import { sourceMapsEnabled } from 'process';
import { FC, useState } from 'react';

export const SendSolForm: FC = () => {
    const {connection}=useConnection()
    const {publicKey,sendTransaction}=useWallet()
    const [confirmed, setConfirmed] = useState(false);
    const [txsignature, settxsignature] = useState('');
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const inputPubkey = formData.get('recipient') as string;
        const amount = Number(formData.get('amount'));
        const transaction = new Transaction();
        const toPubKey = new PublicKey(inputPubkey);

        const setTransferInstruction = SystemProgram.transfer({
            fromPubkey: publicKey as PublicKey,
            toPubkey: toPubKey as PublicKey,
            lamports: amount * LAMPORTS_PER_SOL,
        });

        transaction.add(setTransferInstruction);

        const signature = await sendTransaction(transaction, connection);
        setConfirmed(true);
        settxsignature(signature);

    }

    return (
        <div className="ml-96 mt-36">
            <form onSubmit={handleSubmit}className="mr-4 ml-56 text-3xl ">
                <label className="block font-semibold" htmlFor="amount">Amount (in SOL) to send:</label>
                <input name="amount" type="text" className="text-white bg-purple-500/50 text-center p-2 mt-4" placeholder="e.g. 0.1" required />
                <br/>
                <label className="block mt-4 font-semibold" htmlFor="recipient">Send SOL to:</label>
                <input name="recipient" type="text" className="block bg-purple-500/50 text-white p-2 mt-4" placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className="ml-36 mt-4 mr-4 px-8 p-4 rounded-lg bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... text-white font-semibold text-lg">Send</button>
            </form>
            <div className=" mt-4 text-center mr-96">
          {confirmed ? (
            <p className="w-full">
              You can view your transaction on Solana Explorer at:
              <a 
                href={`https://explorer.solana.com/tx/${txsignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-200 underline text-sm block mt-1 mr-4"
              >
                click me
              </a>
            </p>
          ) : null}
        </div>
        </div>
    )
}
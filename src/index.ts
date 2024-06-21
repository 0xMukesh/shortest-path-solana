import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { existsSync, unlinkSync, writeFileSync } from "fs";

const main = async () => {
  const localnet = "http://127.0.0.1:8899";
  const connection = new Connection(localnet, "confirmed");
  const batch: Array<Keypair> = [];
  const data: Array<{
    to: string;
    from: string;
    signature: string;
  }> = [];
  const size = 100;

  for (let i = 1; i <= size; i++) {
    const user = Keypair.generate();
    try {
      const airdropSignature = await connection.requestAirdrop(
        user.publicKey,
        LAMPORTS_PER_SOL * 0.01
      );
      console.log(`airdrop - ${airdropSignature}`);
      batch.push(user);
    } catch (err) {
      console.log(`an error occured - ${err}`);
      break;
    }
  }

  for (let i = 0; i < batch.length; i++) {
    let index1 = Math.floor(Math.random() * batch.length);
    let index2;

    do {
      index2 = Math.floor(Math.random() * batch.length);
    } while (index2 === index1);

    const user1 = batch[index1];
    const user2 = batch[index2];

    try {
      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: user1.publicKey,
          toPubkey: user2.publicKey,
          lamports: (0.0001 / 2) * LAMPORTS_PER_SOL,
        })
      );
      const transferSignature = await sendAndConfirmTransaction(
        connection,
        transferTransaction,
        [user1],
        {
          commitment: "confirmed",
        }
      );

      console.log(`transfer - ${transferSignature}`);

      data.push({
        to: user2.publicKey.toString(),
        from: user1.publicKey.toString(),
        signature: transferSignature,
      });
    } catch (err) {
      console.log(`an error occured - ${err}`);
      break;
    }
  }

  if (existsSync("data.json")) {
    unlinkSync("data.json");
  }

  writeFileSync("data.json", JSON.stringify(data), {
    encoding: "utf-8",
  });
};

main();

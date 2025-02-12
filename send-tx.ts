import "dotenv/config"
import { FuseSDK } from '@fuseio/fusebox-web-sdk'
import { ethers } from 'ethers'
import { Address, Hash, concat, createClient, createPublicClient, encodeFunctionData, http, Hex } from "viem"
import { generatePrivateKey, privateKeyToAccount, signMessage } from "viem/accounts"
import { lineaTestnet, polygonMumbai, sepolia } from "viem/chains"
import { writeFileSync } from 'fs'

const privateKey =
    process.env.PRIVATE_KEY ??
    (() => {
        const pk = generatePrivateKey();
        writeFileSync(".env", `PRIVATE_KEY=${pk}`);
        return pk;
    })();

async function main() {
    const apiKey = process.env.FUSE_API_KEY;
    const credentials = new ethers.Wallet(privateKey);

    if (!apiKey) {
        throw new Error("FUSE_API_KEY no está definida en el archivo .env");
    }

     // Agregar configuración de red
     const fuseSDK = await FuseSDK.init(apiKey, credentials, {
        withPaymaster: true,
        provider: {
            url: 'https://rpc.fuse.io',  // RPC de la red Fuse
            chainId: 122                  // Chain ID de Fuse
        }
    });
    
    console.log(
        `Dirección de la smart account: https://explorer.fuse.io/address/${fuseSDK.wallet.getSender()}`
    );

    // Agregar la transacción
    const to = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // dirección de vitalik.eth
    const value = ethers.utils.parseEther("0");
    const data = new TextEncoder().encode("0x1234");

    console.log("Enviando transacción...");
    const res = await fuseSDK.callContract(to, value, data);

    console.log(`UserOpHash: ${res?.userOpHash}`);
    console.log("Esperando que la transacción se complete...");

    const receipt = await res?.wait();

    console.log(
        `Transacción completada: https://explorer.fuse.io/tx/${receipt?.transactionHash}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
import "dotenv/config";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { ethers } from "ethers";

async function main() {
    const apiKey = process.env.FUSE_API_KEY;
    if (!apiKey) {
        throw new Error("FUSE_API_KEY no está definida en el archivo .env");
    }
    const credentials = new ethers.Wallet(process.env.PRIVATE_KEY!);

    // Inicializar SDK
    const fuseSDK = await FuseSDK.init(apiKey, credentials);

    // Dirección de la billetera de la cual quieres obtener los tokens
    const smartWalletAddress = fuseSDK.wallet.getSender();

    // Direcciones de los tokens
    const tokens = [
        { address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", name: "FUSE", decimals: 18 },
        { address: "0x8B02644d730F2B4C0368C56468C79668CE4b2eae", name: "PUDU", decimals: 18 },
        { address: "0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5", name: "USDC", decimals: 6 },
        { address: "0x34Ef2Cc892a88415e9f02b91BfA9c91fC0bE6bD4", name: "VOLT", decimals: 18 },
    ];

    for (const token of tokens) {
        try {
            const balance = await fuseSDK.explorerModule.getTokenBalance(
                token.address,
                smartWalletAddress
            );

            const formattedBalance = Number(balance) / 10 ** token.decimals;
            console.log(`Token: ${token.name}, balance: ${formattedBalance}`);
        } catch (error) {
            console.error(`Error al obtener balance de ${token.name}:`, error);
        }
    }
}

main().catch((error) => {
    console.error("Error principal:", error);
    process.exit(1);
});

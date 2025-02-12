import "dotenv/config"
import { FuseSDK } from '@fuseio/fusebox-web-sdk'
import { ethers } from 'ethers'

async function main() {
    const apiKey = process.env.FUSE_API_KEY;
    if (!apiKey) {
        throw new Error("FUSE_API_KEY no está definida en el archivo .env");
    }
    const credentials = new ethers.Wallet(process.env.PRIVATE_KEY!);
    
    // Inicializar SDK
    const fuseSDK = await FuseSDK.init(apiKey, credentials);

    // Dirección de la billetera de la cual quieres obtener los tokens
    const address = "0x241EEDEebA87e28523C8E79f3715285bb402C815"; 
    try {
        // Obtener la lista de tokens usando el módulo explorerModule
        const tokenList = await fuseSDK.explorerModule.getTokenList(address);
        console.log("Lista de tokens:", tokenList);

        // Si deseas imprimir detalles específicos de cada token
        if (tokenList && tokenList.tokens) {
            tokenList.tokens.forEach((token) => {
                console.log("Token:", {
                    name: token.name,
                    symbol: token.symbol,
                    balance: token.balance,
                    address: token.address,
                });
            });
        }
        
    } catch (error) {
        console.error("Error al obtener la lista de tokens:", error);
    }
}

main().catch((error) => {
    console.error("Error principal:", error);
    process.exit(1);
});
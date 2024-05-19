import { Address, toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const senderAddress = provider.sender()?.address;
    if (!senderAddress) {
        throw new Error('Sender address is undefined.');
    }

    const jettonMinter = provider.open(
        JettonMinter.createFromConfig(
            {
                supply: toNano(0), // enter supply
                owner: senderAddress, // enter address owner
                name: 'Token GAME FI', // name
                symbol: 'TGF', // symbol
                image: 'https://bitcoin.org/img/icons/logotop.svg', // image
                description: 'Token for testing....', // escription
            },
            await compile('JettonMinter'),
        ),
    );

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.25'));

    await provider.waitForDeploy(jettonMinter.address);

    console.log(`Deployed JettonMinter at ${jettonMinter.address}`);
}

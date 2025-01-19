import { Sdk } from "@peaq-network/sdk";

const createSdkInstance = async (baseUrl) => {
    try {
        const sdkInstance = await Sdk.createInstance({
            baseUrl: baseUrl,
            seed: "wide east oyster slim planet victory enter alcohol tide earth bid genuine"
        });
        return sdkInstance;
    } 
    catch (error) {
        console.error(`Failed to create SDK instance: ${error}`);
        throw error;
    }
};

const createDID = async (sdk, nameDID) => {
    const block_hash = await sdk.did.create({name: nameDID});
    return block_hash;
};

const readDID = async (sdk, nameDID) => {
    const did = await sdk.did.read({name: nameDID});
    return did;
};

const main = async () => {
    const baseUrl = "wss://wss-async.agung.peaq.network";     // agung base url as given above
    const nameDID = 'myDID';

    console.log(`Creating SDK instance with base URL: ${baseUrl}`);
    // see SDK Quickstart for createSdkInstance() function
    const sdk = await createSdkInstance(baseUrl);

    console.log(`Creating DID with name: ${nameDID}`);

    await sdk.connect();

    // ===========

    // await sdk.connect();

    try {
        const did = await readDID(sdk, nameDID);
        console.log(did);
    }
    catch (error) {
        console.error(`Failed to read DID with error: ${error}`);
        throw error;
    }
    finally {
        await sdk.disconnect();
    }

    console.log(`Connected to ${baseUrl}`);

    // try {
    //     const hash = await createDID(sdk, nameDID);
    //     console.log(hash);
    // }
    // catch(error) {
    //     console.error(`Failed to create SDK instance: ${error}`);
    //     throw error;
    // } 
    // finally {
    //     await sdk.disconnect();
    // }
}

main();



// Use previously stated imports as referenced in SDK Quickstart


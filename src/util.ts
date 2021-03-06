import { Key } from "codechain-keystore/lib/types";
import {
    AssetTransferAddress,
    PlatformAddress
} from "codechain-sdk/lib/key/classes";
import _ = require("lodash");

import { networkId } from "./const";
import { CLIError, CLIErrorType } from "./error";
import { AccountType } from "./types";

export function getAddressFromKey(accountType: AccountType, key: Key): string {
    if (accountType === "platform") {
        const platformAddress = PlatformAddress.fromAccountId(key);
        return platformAddress.toString();
    } else if (accountType === "asset") {
        const assetAddress = AssetTransferAddress.fromTypeAndPayload(1, key, {
            networkId
        });
        return assetAddress.toString();
    } else {
        throw new CLIError(CLIErrorType.InvalidAccountType);
    }
}

export function findMatchingKey(
    accountType: AccountType,
    keys: Key[],
    address: string
): string {
    const addresses = _.map(keys, key => getAddressFromKey(accountType, key));
    const index = _.indexOf(addresses, address);
    if (index === -1) {
        throw new CLIError(CLIErrorType.NoSuchAddress, { address });
    }

    return keys[index];
}

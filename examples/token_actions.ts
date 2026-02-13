import * as fs from 'fs';
import * as path from 'path';
import { AccessToken } from 'amocrm-api-library';

const TOKEN_FILE = path.join('/tmp', 'token_info.json');

interface TokenData {
    accessToken: string;
    refreshToken: string;
    expires: number;
    baseDomain: string;
}

export function saveToken(tokenData: TokenData): void {
    if (
        tokenData
        && tokenData.accessToken
        && tokenData.refreshToken
        && tokenData.expires
        && tokenData.baseDomain
    ) {
        const data = {
            accessToken: tokenData.accessToken,
            expires: tokenData.expires,
            refreshToken: tokenData.refreshToken,
            baseDomain: tokenData.baseDomain,
        };

        fs.writeFileSync(TOKEN_FILE, JSON.stringify(data));
    } else {
        console.error('Invalid access token', tokenData);
        process.exit(1);
    }
}

export function getToken(): { accessToken: AccessToken; baseDomain: string } {
    if (!fs.existsSync(TOKEN_FILE)) {
        console.error('Access token file not found');
        process.exit(1);
    }

    const data: TokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));

    if (
        data
        && data.accessToken
        && data.refreshToken
        && data.expires
        && data.baseDomain
    ) {
        return {
            accessToken: new AccessToken({
                access_token: data.accessToken,
                refresh_token: data.refreshToken,
                expires: data.expires,
            }),
            baseDomain: data.baseDomain,
        };
    } else {
        console.error('Invalid access token', data);
        process.exit(1);
    }
}

import * as dotenv from 'dotenv';
import { AmoCRMApiClient } from 'amocrm-api-library';
import { saveToken, getToken } from './token_actions';
import { printError } from './error_printer';

dotenv.config({ path: [__dirname + '/.env', __dirname + '/.env.dist'] });

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const redirectUri = process.env.CLIENT_REDIRECT_URI!;

const apiClient = new AmoCRMApiClient(clientId, clientSecret, redirectUri);

export { apiClient, saveToken, getToken, printError };

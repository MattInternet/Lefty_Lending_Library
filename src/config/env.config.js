import dotenv from 'dotenv';
import Joi from 'joi';
import * as path from 'path';
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string(),
  PORT: Joi.number().default(5000),
  REACT_APP_RECORD_ENV: Joi.boolean(),
  REACT_APP_TEST_ENV: Joi.boolean(),
  REACT_APP_BUILD_ENV: Joi.string().default('development'),
  REACT_APP_GOOGLE_KEY: Joi.string(),
  REACT_APP_GOOGLE_OAUTH_CLIENTID: Joi.string(),
  REACT_APP_GOOGLE_OAUTH_SECRET: Joi.string(),
  REACT_APP_GOOGLE_CALLBACK_URL: Joi.string(),
  REACT_APP_GOOGLE_CALLBACK_URL_DEV: Joi.string(),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string(),
  GOOGLE_APPLICATION_CREDENTIALS_DEV: Joi.string(),
  FIREBASE_CONFIG: Joi.string(),
  GCLOUD_PROJECT: Joi.string()
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig = {
  env: envVars.NODE_ENV,
  recordEnv: envVars.RECORD_ENV,
  testEnv: envVars.TEST_ENV,
	reactAppBuildEnv: envVars.REACT_APP_BUILD_ENV,
  googleKey: envVars.REACT_APP_GOOGLE_KEY,
  googleOauthClientId: envVars.REACT_APP_GOOGLE_OAUTH_CLIENTID,
  googleOauthSecret: envVars.REACT_APP_GOOGLE_OAUTH_SECRET,
  googleApplicationCredentials: envVars.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS,
	port: envVars.PORT, 
};

export default envConfig;
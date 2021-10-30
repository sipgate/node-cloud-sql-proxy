# node-cloud-sql-proxy

Node wrapper for the [google sql cloud proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy).

## Getting started

```sh
npm install node-cloud-sql-proxy
# or
yarn add node-cloud-sql-proxy
```

Then, connect to the google cloud sql proxy like:

```js
import proxy from 'node-cloud-sql-proxy';

const startup = async () => {
  await proxy.connect();

  // start service
}

startup()
```

### Connect options

```ts
export interface Options {
  dir?: string;
  instances?: string;
  quiet?: boolean;
  gcpCredentialPath?: string;
  gcpCredentials?: string;
}
```

```ts
await proxy.connect({quiet: false, instances:"my-project:my-region:my-instance"});
```

## Environment Variables

Any environment variables defined in an .env file will automatically be loaded when running using connecting via the `node-cloud-sql-proxy`. Variables stored in .env files can be expanded using the format specified by dotenv-expand.

The following table describes which environment variables can be used:
|env                                |description    |example|
|---                                |---            |---|
|NODE_CLOUD_SQL_DIR                 | `-dir` Directory when usign unix sockets, the Proxy places the sockets in the directory specified by the -dir parameter |`/cloudsql`|
|NODE_CLOUD_SQL_INSTANCES           |`-instances` To connect to a specific list of instances, set the instances parameter to a comma-separated list of instance connection strings|`my-project:my-region:my-instance`|
|GOOGLE_APPLICATION_CREDENTIALS_PATH|`-credentials_file` If provided, this json file will be used to retrieve Service Account credentials.  You may set the GOOGLE_APPLICATION_CREDENTIALS environment variable for the same effect.|`/tmp/google_credentials.json`| 
|GOOGLE_APPLICATION_CREDENTIALS     |If provided, this json file will be used to retrieve Service Account credentials.|`/tmp/google_credentials.json`| 
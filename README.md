# ts-node-migrate
A generic typescript database migration cli for potentially multiple databases supported

![npm type definitions](https://img.shields.io/npm/types/typescript)
![GitHub last commit](https://img.shields.io/github/last-commit/khaind/ts-node-migrate)

Support databases:
- Mongodb
- Mysql (TBD)

## Installation
```
npm i ts-node-migrate
```

## Usage: 
Before using the cli, setup environment variables below

````
TSNM_URL=mongodb://localhost:27017/test
TSNM_DB_TYPE=mongodb
TSNM_DIR=migrations
TSNM_TABLE_NAME=changelog
````

You can setup package.json scripts or run cli directly if installed globally
````
tsnm [options] [command]

Options:
  -h, --help      display help for command

Commands:
  new             Creates new migration template
  status          Verify migration status (default)
  up              Doing migration forward
  down            Doing migration backward
  help [command]  display help for command
```` 


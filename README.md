# ts-node-migrate
A generic typescript database migration cli for potentially multiple databases supported

![npm type definitions](https://img.shields.io/npm/types/typescript)
![GitHub last commit](https://img.shields.io/github/last-commit/khaind/ts-node-migrate)

Support databases:
- Mongodb (In Progress)
- Mysql (TBD)

## Installation

## Usage: 

````
tsnm [options] [command]

Options:
  -h, --help      display help for command

Commands:
  init            Creates the migrations directory and configuration file
  new             Creates new migration template
  status          Verify migration status
  up              Doing migration forward
  down            Doing migration backward
  help [command]  display help for command
```` 

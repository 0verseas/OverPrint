# OverPrint

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

## install the Angular CLI
```
sudo npm install -g @angular/cli@8.3.29
cd OverPrint
npm install
```

### Environment settings
Copy example environment settings and edit them with text editor:
1. ```cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts```  
2. ```cp src/environments/environment.ts.example src/environments/environment.ts```


## Required
node v10.9 or higher

## Install bootstrap
[see more](https://loiane.com/2017/08/how-to-add-bootstrap-to-an-angular-cli-project/)
```
npm install bootstrap
npm install ngx-bootstrap --save
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## json-server (暫時沒用到)
[link text](https://oomusou.io/angular/api/)
`npm install -g json-server`

## gs
`apt-get install ghostscript`

## printJS
[Install](https://printjs.crabbly.com/)
[Manual](https://github.com/crabbly/Print.js)

## Docker 🐳
1. Install [Docker](https://docs.docker.com/engine/install/) & [Docker Compose](https://docs.docker.com/compose/install/)
2. Edit docker compose file: `docker/docker-compose.yaml`
2. `cp docker/.env.example docker/.env` and edit it (if you need).
3. If static file doesn't yet be built, you should build it before running docker.
3. `cd docker && docker-compose up -d`


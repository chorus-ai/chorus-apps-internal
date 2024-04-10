# Getting Started with CHoRUS Apps

## How to run

```
cd chorus_apps_internal
git checkout develop
npm install
node server
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### To get temo db started with data

To avoid conflicts, please remove your current `db.sqlite3` file first and restart back-end by running `node server`

Then copy some test waveforms and text to your current `data` folder

Then run command:

```
npx sequelize-cli db:seed:all --debug
```

### Migration

Firstly, run

```
node server
```

Then run

```
npx sequelize-cli db:migrate --debug
```

Finally, restart server and it should work

```
node server
```



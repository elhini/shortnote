Lite and simple app for short notes

## Current features:

- cloud DB storage

#### Fields:
- title
- text (styled)
- create date
- update date
- tags (creatable)

#### Functions:
- filtering (by title, text or tags)
- sorting (by date of create or update)
- direct link to note (private)
- autosave (after 1 second)
- registration & auth (by login & password)
- public sharing (read access)
- admin panel (users list)

## Planned features:

- design (material-UI)

#### Fields:
- group/category (with hierarchy)

#### Functions:
- invitations (by link)
- collaboration (write access)
- TODO-lists (with checkboxes)

## Used technologies:

- languages: JavaScript + TypeScript
- client: React + Material UI
- server: Node.js + Express
- database: MongoDB
- testing: Jest

## Start local demo
0. create your own mongodb instance with following collections: `users`, `sessions`, `notes`, `settings`
1. execute `git clone git://github.com/elhini/shortnote.git` to clone this project repository
2. execute `cd shortnote` to enter the project directory
3. execute `npm install` to install the project dependencies
4. rename `src/config/db.template.js` to `src/config/db.js` and specify your mongodb instance url
5. execute `npm run server` to start your local server instance (it will start at `http://localhost:8000` as a process)
6. execute `npm run client` to start your local client instance (it will open at `http://localhost:3000` in your browser)
7. go to `http://localhost:3000/register` to register a new user

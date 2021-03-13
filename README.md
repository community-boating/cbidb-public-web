# Community Boating Online Member Portal

This is the public-facing web application for Community Boating, live at https://portal.community-boating.org.  This application performs the following functions:

- Membership sales
- Member services e.g. class signup
- Gift certificate sales
- Donations

## Installation/Setup
- copy `ini/config.ini.template` to `ini/config.ini`, change defaults as needed
    - Default ini values should work out of the box; by default the application will connect to `api-dev.community-boating` as the backend
- Run `npm install`
- Run `npm start` to run in development mode, or `npm run build` to build for production

## Contributing

Contributions are always welcome.  Please follow the guidelines at [CONTRIBUTING.md](CONTRIBUTING.md)
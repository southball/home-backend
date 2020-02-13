# Home Backend

## Configuration

The config should be stored in a `.env` file in the working directory where the server is launched.

You can copy `.env.sample` to `.env` and start modifying. The configurations are listed below.

- `FRONTEND_PATH`: This is the file which is served as the website. This should be an absolute path to the `build` folder built in the `home-frontend` project.
- `STATIC_PATH`: This is the folder served as `https://website/static`. This should be an absolute path to the `static` folder built in the `home-frontend` project.
- `PORT`: This is the port which the content is to be served at.
- `GOOGLE_CLIENT_ID`: The Google OAuth2 client ID.
- `GOOGLE_CLIENT_SECRET`: The Google OAuth2 client secret.
- `GOOGLE_CLIENT_CALLBACK_URL`: The OAuth2 callback URL for Google. Should be pointing to `https://website/api/auth/oauth2callback`.
- `DATABASE_PATH`: The path to a Sqlite3 database for storing application data.
- `FILES_FOLDER`: The folder containing the files to be shown in the 'Files' page.
# Home Backend

## Configuration

The config should be stored in a `.env` file in the working directory where the server is launched.

You can copy `.env.sample` to `.env` and start modifying. The configurations are listed below.

- `FRONTEND_PATH`: This is the file which is served as the website. This should be an absolute path to the `index.html` built in the `home-frontend` project.
- `STATIC_PATH`: This is the folder served as `https://website/static`. This should be an absolute path to the `static` folder built in the `home-frontend` project.
- `PORT`: This is the port which the content is to be served at.

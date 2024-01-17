# Kaput Documentation

## Starting the development server for 2D app

- Install dependencies:

```bash
npm i
```

- Start the development server:

```bash
npm run dev
```

- Open your browser and navigate to `http://localhost:3000/` to see the app running.

## Starting the development server for 3D app

- Open a new terminal window and navigate to the `threejs` directory:

```bash
cd threejs
```

- Install dependencies:

```bash
npm i
```

- [ **Optional** ] Install threeJS on your machine:

```bash
npm install --save-dev vite
```

- Start the development server:

```bash
npx vite
```

## Launching the server

- Open a new terminal window and navigate to the `quiz-env` directory:

```bash
cd quiz-env
```

- Launch the server:

```bash
python3 app.py
```

If you can see the following message in the terminal, the server is running successfully:

```bash
  * Running on http://127.0.0.1:8080
```

TIPs:

- If you want to stop the server, press `CTRL + C` in the terminal window where the server is running.
- If you want to restart the server, press `CTRL + C` in the terminal window where the server is running and then run the `python3 app.py` command again.
- If you want to contribute or check an example of route in the server, check the `quiz-env/README.md` file.

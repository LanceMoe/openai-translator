![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)

# OpenAI Translator

A translator app that uses OpenAI GPT-3 to translate between languages. It is a PWA that can be installed on your phone or desktop.

https://translator.lance.moe/

Support ChatGPT engine (GPT 3.5).

<img width="970" alt="image" src="https://user-images.githubusercontent.com/18505474/222828200-948eef23-bf59-43af-ac27-1484c2bcd406.png">

<img width="1336" alt="image" src="https://user-images.githubusercontent.com/18505474/222924658-012a1089-11f1-474a-99c1-c799aa73d793.png">

## Tech Stack

- OpenAI API
- React 18
- Vite 4
- Tailwind CSS 3
- DaisyUI 2
- Axios
- React Router 6
- React Query 4
- PWA
- Cloudflare Pages

I think this project will help you learn these techniques.

If you like this project, please don't forget to give this project a star, thanks.

## Local Development

### 1. Install pnpm

Make sure that pnpm is installed on your computer. If it's not already installed, you can install it:

https://pnpm.io/installation

### 2. Download project dependencies

Navigate to the root directory of your project and run the following command to download project dependencies:

```bash
pnpm install
```

### 3. Start the local server

Run the following command to start the local development server:

```bash
pnpm dev
```

### 4. Open the application

Vite should automatically open your browser.

## Build the Project

### Docker Build

#### 1. Run docker build

Navigate to the root directory of your project in your command line interface and run the following command to build the Docker image:

```bash
docker build -t openai-translator-web .
```

Here, `openai-translator-web` is the name you want to give to the image, and the `.` at the end indicates the current directory.

#### 2. Start the Container

Run the following command to start the container and map the port to your local machine:

```bash
docker run -p 3000:80 openai-translator-web
```

Here, 3000 represents the local port you want to map to the container's 80 port. You can change this to any other port you prefer.

#### 3. Open the Application

In your browser, enter the following URL to access the application:

http://localhost:3000/

### Local Build

#### 1. Install pnpm

Make sure that pnpm is installed on your computer. If it's not already installed, you can install it:

https://pnpm.io/installation

#### 2. Download project dependencies

Navigate to the root directory of your project and run the following command to download project dependencies:

```bash
pnpm install
```

#### 3. Build

Run the following command to build your project:

```bash
pnpm build
```

The compiled files will be placed in the `dist` folder.

#### 4. Deploy

Now you can treat the files in the `dist` folder as a static website and deploy it on the server.

## Credit

- Inspired by https://github.com/yetone/bob-plugin-openai-translator

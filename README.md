This is a Next.js project for a monument store website.

## Description

A minimal website for selling turnkey monuments. Features include:
- Product listings with descriptions
- Public access to the full assortment
- Classic design using Tailwind CSS

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Home page with product listings
- Public assortment without login or registration
- Order form directly from the catalog

## Build

To build for production:

```bash
npm run build
npm start
```

## Deploy on Netlify

1. Зареєструйся або увійди на `netlify.com`.
2. З'єднай свій GitHub-репозиторій з Netlify.
3. Вкажи команду збірки:

```bash
npm run build
```

4. Вкажи папку для публікації:

```text
.next
```

5. Додай файл `netlify.toml` в корінь проєкту, він уже створений.
6. Якщо потрібно, Netlify автоматично встановить плагін `@netlify/plugin-nextjs`.

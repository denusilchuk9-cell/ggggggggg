This is a Next.js project for a monument store website.

## Description

A minimal website for selling turnkey monuments. Features include:
- Product listings with descriptions
- User authentication (login/register)
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
- Login/Register page
- Authentication using NextAuth.js

## Build

To build for production:

```bash
npm run build
npm start
```

## Deploy on Netlify

1. Зареєструйся або увійди на netlify.com.
2. З'єднай свій GitHub репозиторій з Netlify.
3. Вкажи команду збірки:

```bash
npm run build
```

4. Вкажи папку для публікації:

```text
.next
```

5. Додай файл `netlify.toml` в корінь проекту, він уже створений.
6. Якщо потрібно, Netlify автоматично встановить плагін `@netlify/plugin-nextjs`.

## Після реєстрації

- Після успішної реєстрації на сайті, можеш одразу зайти на сторінку `http://localhost:3000/login`.
- Введи email і пароль, щоб увійти.
- Після входу ти потрапиш на головну сторінку, де можна оформити замовлення.
- Якщо хочеш, я можу додати окрему сторінку профілю або історію замовлень.

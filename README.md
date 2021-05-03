# Структура проекта
index.js - Входная точка проекта 

routes.js - Роутинг,все роты приватные, выкидывают на логин, если нет токена

Папка src/api - содержит запросы для работы с сервером

Папка src/assests - Иконки, картинки 

Папка src/components -  Содержит компоненты, например кастомные кнопки и т.д

Папка src/constants -  константы проекта

Папка src/helpers - вспомогательные функции, которые используются на проекте

Папка src/pages - страницы проекта, могут содержать в себе компоненты, необходимые для страницы

Папка src/scss - Общие стили проекта

Папка src/store - Работа с тором проекта, используется redux + redux-saga, redux-saga используется для работы с api.

На проекте используется библиотека styled-components, предназначена для работы со стилями. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


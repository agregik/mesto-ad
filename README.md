# Проектная работа Mesto

Ссылка на опубликованный проект: https://agregik.github.io/mesto-production/

## Команды

- `npm install` — установка зависимостей
- `npm run dev` — локальный сервер разработки (страница откроется в браузере)
- `npm run build` — сборка проекта в папку `dist`
- `npm run preview` — предпросмотр production-сборки
- `npm run deploy` — сборка и публикация на GitHub Pages

## Деплой через GitHub Actions

При `push` в ветку `main` workflow `.github/workflows/deploy.yml` собирает проект и публикует `dist` в публичный репозиторий.

Необходимые секреты в приватном репозитории:

- `PUBLIC_PAGES_TOKEN`
- `PUBLIC_PAGES_REPO` (формат `owner/repository`)
- `PUBLIC_PAGES_BRANCH` (опционально)

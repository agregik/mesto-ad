# Проектная работа Mesto

**Репозиторий:** https://github.com/agregik/mesto-ad  
**Ссылка на опубликованный проект:** https://agregik.github.io/mesto-ad/

## Почему сайт может не открываться

1. **Репозиторий приватный** — на бесплатном GitHub публичный адрес `*.github.io` для приватного репозитория **не работает**.  
   Нужно: **Settings → General → Danger zone → Change visibility → Public**  
   (исходный код останется в этом репозитории; для курса допустимо сделать `mesto-ad` публичным, если нет отдельного `mesto-production`.)

2. **Не включён GitHub Pages** — https://github.com/agregik/mesto-ad/settings/pages  
   - **Source:** Deploy from a branch  
   - **Branch:** `gh-pages`  
   - **Folder:** `/ (root)`  
   - Нажмите **Save**

3. **Ветка `gh-pages` пустая или устарела** — выполните `npm run deploy` или сделайте push в `main` (запустится Actions).

После настройки подождите 1–3 минуты и обновите страницу.

## Команды

- `npm install` — установка зависимостей
- `npm run dev` — локальный сервер разработки
- `npm run build` — сборка в папку `dist`
- `npm run preview` — предпросмотр сборки
- `npm run deploy` — сборка и публикация в ветку `gh-pages` репозитория `mesto-ad`

## Автодеплой

При каждом `push` в ветку `main` workflow `.github/workflows/deploy.yml` собирает проект и обновляет ветку `gh-pages`. Секреты настраивать не нужно.

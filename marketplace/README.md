# Marketplace

# Пререквизиты
- Node.js 25.x (удобно через `nvm use 25.1.0` на Windows)
- Docker Desktop (для локального Postgres) или собственный Postgres 16+
- Git (для клонирования репозитория)

# Быстрый старт

1. **Клонируйте репозиторий**
   ```ps1
   git clone <URL> bic
   cd bic\marketplace
   ```

2. **Создайте файл окружения**
   ```ps1
   copy .env .env.local
   ```
   Отредактируйте `.env.local` если нужно:
   - `DATABASE_URL` — строка подключения Postgres  
   - `ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD` — логин и пароль для админки

3. **Запустите Postgres (вариант через Docker)**
   ```ps1
   docker run --name marketplace-pg `
     -e POSTGRES_PASSWORD=postgres `
     -e POSTGRES_DB=marketplace `
     -p 5432:5432 `
     -d postgres:16
   ```
   > Если используете готовую БД, убедитесь что она доступна по адресу из `DATABASE_URL`.

4. **Установите зависимости**
   ```ps1
   npm install
   ```

5. **Сгенерируйте и примените миграции**
   ```ps1
   npm run db:generate   # обновит SQL-файл на основании схемы Drizzle
   npm run db:migrate    # применит миграции к Postgres
   ```

6. **Заполните данные (по желанию)**
   ```ps1
   npm run db:seed       # создаст/обновит администратора
   npm run db:seed-demo  # добавит демо-инвентарь, если таблицы пустые
   ```

7. **Запустите dev-сервер**
   ```ps1
   npm run dev
   ```
   Приложение будет доступно на http://localhost:3000.

# Полезные команды
- `npm run db:generate` — пересобрать SQL миграцию из `src/db/schema.ts`
- `npm run db:migrate` — применить накопленные миграции
- `npm run db:seed` — создать администратора (используются переменные из `.env`)
- `npm run db:seed-demo` — наполнить витрину тестовыми автомобилями
- `npm run build && npm start` — production-сборка и запуск

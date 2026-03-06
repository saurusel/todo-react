# todo-react

React + TypeScript + Webpack + MirageJS

## Скрипты

Запуск сервера с логами (HTTP + Mirage).
```bash
npm run start
```

Запуск сервера без логов.
```bash
npm run start:no-logs
```

Прод-сборка (с логами)
```bash
npm run start
```

Просмотр production-сборки из папки dist.
```bash
npm run preview
```

## Mirage API

* GET /api/tasks -> { tasks: [...] }
* POST /api/tasks -> { task: ... }
* PATCH /api/tasks/:id -> { task: ... }
* DELETE /api/tasks/:id -> 204 No Content

## Ненбольшое пояснение по проекту
- `db.json` используется как начальный источник данных,
- CRUD идёт через Mirage,
- данные задач после reload возвращаются к состоянию из `db.json`.
# Конфигурации

- config.local.json — локальный конфиг с чувствительными данными (в .gitignore).
- config.json — общий (без секретов), можно коммитить.

Пример config.local.json:

```
{
  "githubToken": "<YOUR_TOKEN>",
  "repo": "AlexKhvostov/charts"
}
```

Пример config.json (опционально):

```
{
  "feature": {
    "enableUpperHints": false
  }
}
```

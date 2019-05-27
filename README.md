## WebAuthn Demo

### Пример WebAuthn PWA приложения

Приложение для беспарольной аутентификации на основе FIDO2 платформенных
и внешних аутентификаторов, таких как датчики отпечатов пальцев на
телефонах Android или Ybico key

### Установка и запуск

Создаем в корне проекта файл `.env`
```
MONGODB_URI=mongodb://<mlab_user>:<mlab_password>@<mlab_connection_url>
MONGODB_URI_LOCAL=mongodb://mongodb:27017
SESSION_SECRET=may_awesome_secret
REACT_APP_API=http://localhost/api/
ORIGIN=http://localhost
RP_ID=localhost
```

Устанавливаем:
`docker, docker-compose` [https://docs.docker.com/install/]

Запуск командой:

```
docker-compose down && docker-compose up
```

### Верификация WebAuthn объектов AttestationObject, AssertionObject
`fido2-lib` [https://github.com/mwmaleks/fido2-lib]

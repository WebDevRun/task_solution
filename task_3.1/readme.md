# 1. Билеты на событие

## Ответ на вопрос 1

Из задания я не совсем понял, может ли быть так что у одного заказа может несколько типов билетов. Например, пришла группа людей.
У одного человека из группы есть льгота. Ему дадут билет, который и групповой и льготный? Я думаю нет, т.е. ему дадут только либо групповой, либо льготный.

Необходимо создать отдельную таблицу с типами билетов. Название таблицы "ticket_type".

Например так:

| id  | name      | price |
| --- | --------- | ----- |
| 1   | льготный  | 10    |
| 2   | групповой | 15    |
| 3   | обычный   | 0     |

Где:

- id - инкрементальный порядковый номер (первичный ключ).
- name - название типа билета.
- price - цена.

Затем добавить столбец "type_id" в таблицу "Список заказов". "ticket_type_id" будет внешним ключем по отношению к таблице "ticket_type".

Таблица "Список заказов" будет выглядить следюущим образом:

| id  | event_id | event_date          | ticket_adult_price | ticket_adult_quantity | ticket_kid_price | ticket_kid_quantity | barcode  | user_id | equal_price | created             | ticket_type_id |
| --- | -------- | ------------------- | ------------------ | --------------------- | ---------------- | ------------------- | -------- | ------- | ----------- | ------------------- | -------------- |
| 1   | 003      | 2021-08-21 13:00:00 | 700                | 1                     | 450              | 0                   | 11111111 | 00451   | 700         | 2021-01-11 13:22:09 | 1              |
| 2   | 006      | 2021-07-29 18:00:00 | 1000               | 0                     | 800              | 2                   | 22222222 | 00364   | 1600        | 2021-01-12 16:62:08 | 2              |
| 3   | 003      | 2021-08-15 17:00:00 | 700                | 4                     | 450              | 3                   | 33333333 | 00015   | 4150        | 2021-01-13 10:08:45 | 3              |

Также стоит учесть, что необходимо изменить формулу подсчета "equal_price" с учетом "ticket_type"."price".

Для внесения данных в таблицу "ticket_type" стоит создать справочник "Типы билетов" на фронте.
При оформления заказа человек будет получать уже внесенные данные с сервера и будет выбирать например из разворачивающегося списка необходимый тип билета.

## Ответ на вопрос 2

Так как у каждого билета должен быть свой уникальный баркод.
Соответсвенно одна запись в таблице "Список заказов" будет содержать один билет с уникальным баркодом.
В таблице "Список заказов" столбцы "ticket_adult_quantity" и "ticket_kid_quantity" можно удалить.
Данные о билетах можно вынести в отдельную таблицу "ticket".
Данные "ticket_adult_price" и "ticket_kid_price" можно перенести в таблицу "ticket" без учета цен из столбца "event_id".
А подсчет столбца "equal_price" можно изменить с учетом цен из столбцов "event_id" и "ticket_id".

| id  | name      | price |
| --- | --------- | ----- |
| 1   | льготный  | 500   |
| 2   | групповой | 600   |
| 3   | детский   | 400   |
| 4   | взрослый  | 700   |

Где:

- id - инкрементальный порядковый номер (первичный ключ).
- name - название билета.
- price - цена.

Таким образом таблицу "Список заказов" можно привести в данному виду:

| id  | event_id | event_date          | ticket_id | barcode  | user_id | equal_price | created             |
| --- | -------- | ------------------- | --------- | -------- | ------- | ----------- | ------------------- |
| 1   | 003      | 2021-08-21 13:00:00 | 4         | 11111111 | 00451   | 700         | 2021-01-11 13:22:09 |
| 2   | 003      | 2021-08-21 13:00:00 | 4         | 44444444 | 00451   | 700         | 2021-01-11 13:22:42 |
| 3   | 006      | 2021-07-29 18:00:00 | 2         | 22222222 | 00364   | 1600        | 2021-01-12 16:62:08 |
| 4   | 003      | 2021-08-15 17:00:00 | 3         | 33333333 | 00015   | 4150        | 2021-01-13 10:08:45 |

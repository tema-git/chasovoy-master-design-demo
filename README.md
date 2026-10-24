# Часовых дел мастер — независимая демоконцепция

Демонстрационный сайт мастерской ремонта часов в Москве. Это не официальный сайт компании. Оплата и реальная отправка заявок не подключены. Формы не сохраняют персональные данные и очищаются после успешной локальной проверки.

## Подтверждённые сведения

- Название из исходного списка компаний: **Часовых дел мастер**.
- Специализация: ремонт часов.
- Адрес: Москва, Русаковская улица, 31, 1 этаж; метро «Сокольники».
- Телефон: +7 992 209-62-12.
- Почта: c.delmaster@mail.ru.
- ВКонтакте: https://vk.com/id239632957
- Публичный источник: https://msk.spravka.city/company/chasovyh-del-master-8
- Сведения повторно проверены при подготовке концепции 24 октября 2026 года. Порядок слов в названии справочника может отличаться; на сайте сохранено название из списка компаний.

Цены, конкретные сроки, гарантии, отзывы, часы работы и неподтверждённые виды ремонта не указаны. Возможность ремонта и визита предлагается обсуждать с мастером.

## Реализация

Статические `index.html`, `style.css`, `app.js`. Все локальные URL относительные: сайт работает как в корне домена, так и в подпапке GitHub Pages. Никакой сборки и внешнего JavaScript не требуется.

- Самостоятельно созданные SVG-иллюстрации корпуса, циферблата и шестерней. Это художественная модель, а не изображение конкретных часов или работ мастерской.
- Локальные шрифты Golos Text. Лицензия SIL Open Font License сохранена в `assets/OFL-Golos-Text.txt`.
- Локальный GSAP 3.15.0 и ScrollTrigger из официального npm-пакета `gsap`. Источник и integrity пакета: `assets/vendor/gsap-source.json`. Лицензионные уведомления производителя сохранены в заголовках JS-файлов.
- Анимация курсора выполняется только при точном указателе и видимом первом экране. Она останавливается после достижения позиции, при уходе курсора, скрытии страницы и выходе из области просмотра.
- Прокрутка вращает стрелки и шестерни, раздвигает слои механизма. Системное уменьшение движения отключает эти эффекты.
- Выделение текста меняет только цвет букв с прозрачным фоном.
- Липкая шапка сохраняет доступ к кнопке «Контакты», в том числе на телефоне.

## Интерактив

«Поймайте точный момент» — три задания: 10:10, 06:30 и 08:45. Часы и минуты управляются ползунками или числовыми полями; есть проверка, подсказка при ошибке, переход к следующему заданию, победа и перезапуск. Скорость прохождения не учитывается.

Демоформа содержит имя, телефон, тему обращения и выбор обратного звонка / обсуждения визита. Native validation дополнена проверкой номера. Кнопка отправки выключена в исходном HTML и включается только после установки `preventDefault` обработчика. Персональные поля не сериализуются нативной формой. Нет localStorage, cookies, аналитики и запросов на отправку данных.

## Предпросмотр

Из папки сайта: `python3 -m http.server 4320`. Откройте локальный адрес сервера. Для публикации загрузите содержимое папки целиком. `robots.txt` и meta robots закрывают демоверсию от индексирования.


## Cursor interaction update — 2026-10-24

All five main sections respond to pointer position through independent decorative layers. Native cursor, selectable text, input positions and click targets remain stable. Motion runs only while a visible scene settles after pointer input, and stops offscreen, on blur, hidden page, pointer mode changes and reduced-motion changes. Touch and keyboard focus receive immediate visual feedback.

Navigation and CTA arrows share one gesture: north-east at rest, horizontal right on hover or keyboard focus. Page scroll never rotates UI arrows; other thematic scroll effects remain. Reduced motion switches arrow direction immediately and disables decorative displacement.

- Hero: watch depth and metallic reflection.
- Workshop: miniature dial and hands, orange detail line, topic feedback.
- Mechanism: pointer wrapper moves independently of scroll-driven exploded layers.
- Game: clock movement and glass reflection, while inputs and hands remain functional.
- Contact: balance wheel, bridge, hand and form shadow.

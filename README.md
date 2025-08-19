# SSR Blog — Next.js 15 + Firestore + Redux Toolkit + SWR + Zod + styled-components

Односторінковий блог з SSR (App Router), клієнтським кешем через SWR, станом у Redux Toolkit і валідацією форм через Zod + React Hook Form. Дані зберігаються у Firebase **Firestore**, автентифікація — **Anonymous**.

## ⚙️ Стек
- **Next.js 15 (App Router, SSR/SSG)**
- **TypeScript**
- **styled-components** (SSR інтеграція)
- **Redux Toolkit** (+ hooks)
- **SWR** (дані/рефреш/оптимістичні апдейти)
- **Zod + React Hook Form** (валідація)
- **Firebase**: Firestore (posts, comments), Auth (Anonymous)
- **Vitest + React Testing Library** (тести)

## ✅ Функціонал
- Список постів (SSR + SWR fallback, адаптив)
- Створення поста (RHF + Zod, оптимістичне оновлення)
- Детальна сторінка поста (SSR + SWR)
- Коментарі до поста (список + форма), лічильник коментарів на картці
- Пошук/фільтр за тегом/сортування (Redux)
- Редагування/видалення власного поста
- Skeleton-лоадери, дружні empty/error повідомлення, базова a11y

## 🗂️ Структура (скорочено)
```
src/
  app/
    _ui/
      Header.tsx
    posts/
      [id]/page.tsx
    layout.tsx
    page.tsx
  features/
    auth/
      initFirebaseClient.ts
      initFirebaseAdmin.ts
      AuthGate.tsx
    posts/
      api/{client.ts, server.ts, swr.ts}
      components/{PostCard.tsx, PostForm.tsx, PostView.tsx, EditPostForm.tsx, PostsList.tsx}
      model/{schema.ts, types.ts}
    comments/
      api/{client.ts, swr.ts}
      components/{Comments.tsx, CommentForm.tsx}
      model/{schema.ts, types.ts}
  store/
    slices/{authSlice.ts, filtersSlice.ts}
    hooks.ts
    index.ts
  ui/{Button.tsx, Input.tsx, TextArea.tsx, Skeleton.tsx, Msg.tsx}
```

## 🔐 Змінні середовища
Створи `.env.local` (локально) або додай змінні на платформі деплою.

**Рекомендований варіант (окремо email/ключ):**
```
NEXT_PUBLIC_FB_API_KEY=...            # з Firebase web app
NEXT_PUBLIC_FB_AUTH_DOMAIN=...        # напр. blogtestwork.firebaseapp.com
NEXT_PUBLIC_FB_PROJECT_ID=...         # напр. blogtestwork

FB_CLIENT_EMAIL=firebase-adminsdk-xxxxx@<project-id>.iam.gserviceaccount.com
FB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...=\n-----END PRIVATE KEY-----\n"
```
> Візьми `client_email` та `private_key` із **Project settings → Service accounts → Generate new private key** у Firebase Console. У `FB_PRIVATE_KEY` символи переходу рядка — як `\n` (буквально).

**Альтернатива (один JSON):**
```
FB_SERVICE_ACCOUNT={"type":"service_account","project_id":"<project-id>","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxx@<project-id>.iam.gserviceaccount.com","client_id":"...","token_uri":"https://oauth2.googleapis.com/token"}
```

## 🔒 Firestore Rules (Production)
У **Firestore → Rules** опублікуй:
```
// Безпечні базові правила: читати можуть усі,
// писати — лише авторизовані (анонім теж ок),
// редагувати/видаляти — тільки автор поста/комента.
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.authorUid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.authorUid == request.auth.uid;

      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null && request.resource.data.authorUid == request.auth.uid;
        allow update, delete: if request.auth != null && resource.data.authorUid == request.auth.uid;
      }
    }
  }
}
```

## ▶️ Запуск локально
```bash
npm i
# заповни .env.local як вище
npm run dev
# відкрий http://localhost:3000
```

## 🧪 Тести
```bash
npm run test          # одноразово (Vitest)
npm run test:watch    # вотч-режим
```
> В проекті налаштовані базові тести: Zod-схеми, Redux reducers, CRUD createPost, простий UI тест для PostCard.

## 🛠️ Скрипти (package.json)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT",
    "test": "vitest --run",
    "test:watch": "vitest"
  },
  "engines": { "node": ">=18.18.0" }
}
```

## 🚀 Деплой

### Railway
1. Запуш репозиторій на GitHub.
2. Railway → **New Project → Deploy from GitHub**.
3. У **Variables** додай:
   - `NEXT_PUBLIC_FB_API_KEY`
   - `NEXT_PUBLIC_FB_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FB_PROJECT_ID`
   - **і** або `FB_SERVICE_ACCOUNT`, **або** `FB_CLIENT_EMAIL` + `FB_PRIVATE_KEY`.
4. Railway використає: **Build** `npm run build`, **Start** `npm start`.
5. Після білду відкрий виданий домен. Якщо біла сторінка — перевір **Logs** (найчастіше — формат приватного ключа).

### Vercel (альтернатива)
1. **Import Project** з GitHub.
2. Встанови ті ж змінні середовища (Project Settings → Environment Variables).
3. Deploy. За потреби обери регіон, ближчий до Firestore (Europe).

## 🧭 Нотатки по архітектурі
- **Feature-first** структура: кожна фіча містить API, моделі та UI-компоненти поруч.
- **SSR + SWR**: сторінки віддають готовий HTML (SEO/перформанс), SWR оновлює дані на клієнті.
- **Auth**: Anonymous; користувач підхоплюється у Redux через `AuthGate`.
- **Коментарі**: саб-колекції `posts/{id}/comments` з підрахунком через `getCountFromServer` (кеш через SWR).
- **styled-components**: серверна інжекція стилів; адаптив — mobile-first.
- **Тести**: Vitest + RTL — схеми, reducers, createPost, простий UI.

## 🔮 Можливі покращення
- Денормалізований `commentsCount` у документі поста (Cloud Function/транзакції).
- Пагінація постів/коментарів; реальний час (`onSnapshot`).
- Авторизація email/social; ролі.
- E2E через Playwright.


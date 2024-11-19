FROM node:20-alpine

ARG DATABASE_URL=postgresql://postgres:sheninthjr@localhost:5432/mydb

WORKDIR /usr/src/app

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN DATABASE_URL=$DATABASE_URL npx prisma generate

RUN DATABASE_URL=$DATABASE_URL yarn build

EXPOSE 3000

CMD ["yarn", "start"]

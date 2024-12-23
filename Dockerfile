FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install yarn

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["yarn", "dev"]

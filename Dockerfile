FROM node:22-alpine3.23

WORKDIR /app

RUN apk add --no-cache git

ENV HUSKY=0

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3003

CMD ["node", "dist/main.js"]








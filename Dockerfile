FROM node:20-alpine3.19 AS build
WORKDIR /src
COPY package.json yarn.lock /src/
RUN yarn install
COPY . .
RUN yarn build


FROM node:20-alpine3.19
WORKDIR /app
COPY --from=build /src/dist /app
COPY package.json yarn.lock /app/
COPY /config /app/config
ENV TZ=Asia/Shanghai
RUN yarn install --omit=dev

CMD ["npm","start"]




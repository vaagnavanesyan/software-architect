FROM node:16-alpine3.11 as builder
WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn && yarn cache clean
COPY . .
RUN yarn build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:14-alpine as build-stage

RUN apk add python make g++ --no-cache

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine as production-stage

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g","daemon off;"]
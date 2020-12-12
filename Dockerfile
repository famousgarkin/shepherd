FROM node:14-alpine as build
RUN apk update
RUN apk add git
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run test
RUN npm run build

FROM node:14-alpine as cleanup
COPY --from=build /app /app
RUN rm -rf /app/node_modules

FROM node:14-alpine
COPY --from=cleanup /app /app
WORKDIR /app
RUN npm install http-server
CMD ["./node_modules/.bin/http-server", "--port", "80"]
EXPOSE 80

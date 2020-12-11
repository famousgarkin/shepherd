FROM node:4
COPY . /app
WORKDIR /app
RUN npm install --ignore-scripts
RUN ./node_modules/.bin/bower install --allow-root
RUN npm run test
RUN npm run build
RUN npm install http-server
CMD ["./node_modules/.bin/http-server", "--port", "80"]
EXPOSE 80

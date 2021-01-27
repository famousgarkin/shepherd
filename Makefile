default:

build: export COMPOSE_FILE := ./docker-compose.build.yml
build:
	docker-compose build --no-cache --force-rm
	docker-compose up -d --force-recreate
	docker-compose run --rm curl --silent -D - --output /dev/null --fail --show-error http://shepherd
	docker-compose down

install:
	docker-compose run --rm app npm install

format:
	docker-compose run --rm app npm run format

test:
	docker-compose run --rm app npm run test

start:
	docker-compose up --force-recreate

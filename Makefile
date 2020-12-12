default:

install:
	docker-compose run --rm app npm install

lint:
	docker-compose run --rm app npm run lint

test:
	docker-compose run --rm app npm run test

.PHONY: build
build:
	docker-compose run --rm app npm run build

start:
	docker-compose up app

watch:
	docker-compose up

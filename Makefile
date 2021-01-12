default:

install:
	docker-compose run --rm app npm install

format:
	docker-compose run --rm app npm run format

test:
	docker-compose run --rm app npm run test

watch:
	docker-compose up --force-recreate

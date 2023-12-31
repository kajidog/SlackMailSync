init:
	docker compose -f compose.init.yml up
up:
	docker compose up -d
	@make logs-watch
stop:
	docker compose stop
down:
	docker compose down --remove-orphans
restart:
	@make down
	@make up
build:
	docker compose exec app npm run build
prod-build:
	docker compose up -d
	docker compose exec app npm run build
	docker compose down --remove-orphans
	@make prod-up
prod-up:
	docker compose -f compose.prod.yml up -d
prod-stop:
	docker compose -f compose.prod.yml stop
prod-down:
	docker compose -f compose.prod.yml down --remove-orphans
prod-restart:
	@make prod-down
	@make prod-up
ps:
	docker compose ps
logs:
	docker compose logs
logs-watch:
	docker compose logs --follow
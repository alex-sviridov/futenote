# Makefile
.PHONY: dev prod

dev-down:
	docker compose -f compose.yml -f compose.dev.yml down

dev: dev-down
	 docker compose -f compose.yml -f compose.dev.yml up --watch

dev-rebuild: dev-down
	docker compose -f compose.yml -f compose.dev.yml up --build --watch

prod-down:
	docker compose -f compose.yml -f compose.prod.yml down

prod-rebuild: prod-down
	docker compose -f compose.yml -f compose.prod.yml up -d --build

prod: prod-down
	docker compose -f compose.yml -f compose.prod.yml up -d
.PHONY: build up down logs shell restart

SERVICE ?= app

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f $(SERVICE)

shell:
	docker compose exec $(SERVICE) sh

restart:
	docker compose restart

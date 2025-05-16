# Global setup
# export COMPOSE_BAKE=true

# Variables
# Commands
dev:
	COMPOSE_BAKE=true docker-compose --profile dev up --build
prod:
	COMPOSE_BAKE=true docker-compose --profile prod up --build
stop:
	docker-compose down
clean:
	docker-compose down --volumes --remove-orphans
	rm -rf node_modules package-lock.json
logs:
	docker-compose logs -f
rebuild:
	docker-compose down --volumes --remove-orphans
	COMPOSE_BAKE=true docker-compose up --build
install:
	docker exec sokoke_planner-dev npm install $(pkg)
install-dev:
	docker exec sokoke_planner-dev npm install --save-dev $(pkg)
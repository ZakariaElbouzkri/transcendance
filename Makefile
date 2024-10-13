# containers=$(docker ps -aq)

images = $(shell docker image ls -aq)

all: up

up:
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down

build:
	docker-compose -f docker-compose.yml build

# delete_containers: $(containers)
# 	docker rm $(containers)

delete_images:
	if [ -n "$(images)" ]; then \
		docker rmi $(images); \
	else \
		echo "No images to delete"; \
	fi

fclean: down delete_images
	# docker system prune -a --force
	# docker network rm $$(docker network ls -q); \
	# docker volume rm $$(docker volume ls -q); \

.PHONY: all up down build fclean

.SILENT: all up down build fclean delete_images

COMPOSE_SERVICE=docker-compose -p virify-app

# ----------
# SETUP
# ----------

up:
		${COMPOSE_SERVICE} -f docker-compose.yml up --build -d

exec:
		${COMPOSE_SERVICE} exec webapp /bin/sh

exec-db:
		${COMPOSE_SERVICE} exec database /bin/sh

stop:
		${COMPOSE_SERVICE} down
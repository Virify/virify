COMPOSE_SERVICE=docker-compose -p virify-app

# @TODO
# Create a new bashscript that will automatically generate an env
# file with useful defaults (e.g. a default password for the dB)
# and use that to populate the `docker-compose.yml`. This will
# prevent any password added to that file from being accidentally
# committed.
#
# e.g. the following could be used
# --- docker-compose.yml ---
# database:
#   image: postgis/postgis:17-3.4
#   restart: always
#   ports:
#     - "5432:5432"
#   environment:
#     POSTGRES_USER: ${DB_USER:-virify-user}
#     POSTGRES_PASSWORD: ${DB_PASSWORD}
#     POSTGRES_DB: ${DB_NAME:-virify}
#
# This script will also be useful for non-Docker users and can be
# used to replace the existing `.env.example` file

# ----------
# ENVS
# ----------
# ifneq (,$(wildcard ./.env))
# 	include .env
# 	export DATABASE_PASSWORD
# endif

# env:
# 		@if [ -f .env ]; then\
# 			echo "Env already exists...";\
# 			echo "DATABASE_PASSWORD=${DATABASE_PASSWORD}";\
# 			exit;\
# 		else\
#				< RUN BASH SCRIPT HERE >
# 			touch .env && printf "DATABASE_NAME=\nDATABASE_USER=\nDATABASE_PASSWORD=\nDATABASE_URL=\n\nEMAIL_BASE_URL=\nINTERNAL_EMAIL=\n\nNOMINATIM_API_URL=\n\nSES_ACCESS_KEY_ID=\nSES_SECRET_ACCESS_KEY=" >> .env;\
# 		fi;


# ----------
# Setup
# ----------

up:
		${COMPOSE_SERVICE} -f docker-compose.yml up --build -d

exec:
		${COMPOSE_SERVICE} exec webapp /bin/sh

exec-db:
		${COMPOSE_SERVICE} exec database /bin/sh

start:
		${COMPOSE_SERVICE} start

stop:
		${COMPOSE_SERVICE} stop

down:
		${COMPOSE_SERVICE} down

# ----------
# Aliases
# ----------
build:
		@make up
SHELL := /bin/bash
DATE=$(shell date +"%Y%m%d" | tr -d '\n')
PWD := $(shell pwd)

all:
	:

develop:
	bundle exec guard -i &
	DISABLE_WHITELIST=true bundle exec jekyll serve --config _config.yml,_config_dev.yml --incremental --watch &

stop:
	-pkill -f guard
	-pkill -f _guard-core
	-pkill -f jekyll

.PHONY: all

SHELL := /bin/bash
DATE=$(shell date +"%Y%m%d" | tr -d '\n')
PWD := $(shell pwd)
GREP := $(shell command -v ggrep || command -v grep)

.PHONY: help develop clean build rebuild stop

help:
	@$(GREP) --only-matching --word-regexp '^[^[:space:].]*:' Makefile | sed 's|:[:space:]*||'

develop:
	bundle exec guard -i &
	DISABLE_WHITELIST=true bundle exec jekyll serve --config _config.yml,_config_dev.yml --incremental --watch &

clean:
	bundle exec jekyll clean

build:
	bundle exec jekyll build

rebuild: clean build

stop:
	-pkill -f guard
	-pkill -f _guard-core
	-pkill -f jekyll

.PHONY: all

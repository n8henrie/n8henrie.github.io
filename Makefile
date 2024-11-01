SHELL := /usr/bin/env bash
DATE=$(shell date +"%Y%m%d" | tr -d '\n')
PWD := $(shell pwd)
GREP := $(shell command -v ggrep || command -v grep)
SED := $(shell command -v gsed || command -v sed)

.PHONY: help
help:
	@$(GREP) --only-matching --word-regexp '^[^[:space:].]*:' Makefile | $(SED) 's|:[[:space:]]*||'

.PHONY: develop
develop: clean
	bundle exec guard -i &
	DISABLE_WHITELIST=true bundle exec jekyll serve --config _config.yml,_config_dev.yml --incremental --watch --drafts &
	@until [ "$$(curl --silent --write-out "%{http_code}" --output /dev/null http://localhost:4000)" -eq 200 ]; do echo "Waiting for jekyll server..."; sleep 2; done
	-open "http://localhost:4000"

.PHONY: clean
clean:
	bundle exec jekyll clean

.PHONY: build
build:
	bundle exec jekyll build

.PHONY: rebuild
rebuild: clean build

.PHONY: stop
stop:
	-pkill -f guard
	-pkill -f _guard-core
	-pkill -f jekyll

.PHONY: update
update:
	rm -f Gemfile.lock
	BUNDLE_FORCE_RUBY_PLATFORM=true nix run nixpkgs#bundix -- --lock

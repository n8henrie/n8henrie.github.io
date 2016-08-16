SHELL := /bin/bash
DATE=$(shell date +"%Y%m%d" | tr -d '\n')
PWD := $(shell pwd)

all:
	:

get_bootstrap:
	# rm -f bootstrap-4*-dist.zip
	# wget $$(wget -qO- https://api.github.com/repos/twbs/bootstrap/releases | \
		jq 'first(.[] | select(.["tag_name"] | startswith("v4")))["assets"][]["browser_download_url"]' | \
		tr -d '"')
	# unzip bootstrap-4*-dist.zip
	-git clone https://github.com/twbs/bootstrap.git -b v4-dev --depth 1
	cp -r bootstrap/scss/* _sass/bootstrap/

develop:
	DISABLE_WHITELIST=true bundle exec jekyll build
	bundle exec guard -i &
	DISABLE_WHITELIST=true bundle exec jekyll serve --incremental --watch &

stop:
	-pkill -f guard
	-pkill -f _guard-core
	-pkill -f jekyll

.PHONY: all

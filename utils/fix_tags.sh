#! /bin/bash

for in_post in "$@"; do
  tags="$(gawk '/^tags:/,!/^(- |tags:)/' $in_post | head -n -1)"
  echo $tags
done

#! /bin/bash
set -e

while read filepath <&3; do
  filename="$(basename "${filepath}")"

  post_name="${filename%\.*}.md"
  post_path="_posts/${post_name}"

  if [ ! -e "${post_path}" ]; then
    echo "${post_path} doesn't exist"
  else
    nvim -O +"vimgrep \<script.*\</script\> %" +"cw" "${filepath}" "${post_path}"
  fi
done 3< <(ag -l "$1" "${@:2}")

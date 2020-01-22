#!/usr/bin/env bash
set -eu -o pipefail

# The directory of the currently running file
declare -r __dirname="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

main() {
  local output="${__dirname}/data"

  if [ ! -d "$output" ]; then
    mkdir "${__dirname}/data"
  fi

  cd "${__dirname}/data"

  curl --output 'eng-kjv2006_#1.zip' 'https://ebible.org/Scriptures/eng-kjv2006_{html,usfm,usfx,xetex}.zip'

  for f in *.zip; do
    unzip "$f" -d "${f%.zip}"
  done
}

main "$@"

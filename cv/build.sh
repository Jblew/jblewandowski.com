#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"
set -e
set +x

apt-get update
apt install -y build-essential git ruby ruby-dev
gem install bundler
bundle install
bundle exec jekyll build
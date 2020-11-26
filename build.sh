#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
set -e


## Config
PROJECT_DIR="${DIR}"
DIST_DIR="${PROJECT_DIR}/dist"
SITE_ROOT_DIR="${PROJECT_DIR}/root"
SITE_ROOT_STATIC_DIR="${PROJECT_DIR}/root_static"
SITE_BLOG_DIR="${PROJECT_DIR}/blog"


## Build
rm -rf "${DIST_DIR}"
mkdir "${DIST_DIR}"

cp -R "${SITE_ROOT_STATIC_DIR}" "${DIST_DIR}"

"${SITE_ROOT_DIR}/build.sh"
cp -R "${SITE_ROOT_DIR}/_site" "${DIST_DIR}"

mkdir "${SITE_BLOG_DIR}"
"${SITE_BLOG_DIR}/build.sh"
cp -R "${SITE_BLOG_DIR}/dist" "${SITE_BLOG_DIR}"

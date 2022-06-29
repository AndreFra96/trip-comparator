#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

git add .
git commit -m "deploy commit"
git push

#push subtree
git subtree push --prefix dist origin gh-pages

cd -
#!/bin/bash
git pull origin master
npm install
docker build -t mediadiary-client ../client
docker build -t mediadiary-server ../server

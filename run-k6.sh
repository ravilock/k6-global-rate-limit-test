#!/bin/bash

FILE=$1

docker run --rm \
  --network host \
 -v "$(pwd)"/dist:/scripts \
  grafana/k6:latest run /scripts/"$FILE"

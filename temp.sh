#!/bin/bash

counter=0
while true; do
  counter=$((counter+1))
  # awk '{print "u_temp,"$1}' $counter
  #awk '{print "u_temp,"$1}' counter
  echo "u_temp,$counter."
  # printf "u_temp,%s\n" $counter
  sleep 0.016
done

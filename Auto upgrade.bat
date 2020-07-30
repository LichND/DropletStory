echo off
set /p comment="Enter upgrade comment: "
git fetch
git add *
git commit -m "%comment%"
git pull
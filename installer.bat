@echo off
set Local
@title "npm installer for seoa bot initial setup."
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:LOOP
set /p YN=Node.js is already installed?
if /i "%YN%" == "y" goto I1
if /i "%YN%" == "n" goto Node
goto LOOP
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:Node
start https://nodejs.org/dist/v10.16.3/node-v10.16.3-x64.msi
cls
echo installing......
echo restart after fully installing node.js
pause
goto QUIT
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I1
set /p YN=If you want to install all of needed modules, press y. If you want to install individual modules, press n.
if /i "%YN%" == "y" goto I2
if /i "%YN%" == "n" goto I3
goto I1
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I2
echo starting installing all of needed modules from npm. Do not close this window while installing.
pause
npm install discord.js
npm install diagflow
npm install fluent-ffmpeg
npm install ffmpeg
npm install i18n
npm install opusscript
npm install os
npm install random-hex-color
npm install rethinkdb
npm install sangoon_is_math
npm install yt-search
npm install ytdl-core
pause
echo fully installed modules
pause
goto QUIT
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I3
set /p YN=Install discord.js?
if /i "%YN%" == "y" goto I4
if /i "%YN%" == "n" goto I5
goto I3
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I4
echo Installing discord.js
pause
npm install discord.js
pause
echo Installed discord.js
goto I5
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I5
set /p YN=Install diagflow?
if /i "%YN%" == "y" goto I6
if /i "%YN%" == "n" goto I7
goto I5
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I6
echo Installing diagflow
pause
npm install diagflow
pause
echo Installed diagflow
goto I7
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I7
set /p YN=Install fluent-ffmpeg?
if /i "%YN%" == "y" goto I8
if /i "%YN%" == "n" goto I9
goto I7
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I8
echo Installing fluent-ffmpeg
pause
npm install fluent-ffmpeg
pause
echo Installed fluent-ffmpeg
goto I9
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I9
set /p YN=Install ffmpeg?
if /i "%YN%" == "y" goto I10
if /i "%YN%" == "n" goto I11
goto I9
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I10
echo Installing ffmpeg
pause
npm install ffmpeg
pause
echo Installed ffmpeg
goto I11
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I11
set /p YN=Install i18n?
if /i "%YN%" == "y" goto I12
if /i "%YN%" == "n" goto I13

goto I11
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I12
echo Installing i18n
pause
npm install i18n
pause
echo Installed i18n
goto I13
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I13
set /p YN=Install opusscript?
if /i "%YN%" == "y" goto I14
if /i "%YN%" == "n" goto I15
goto I13
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I14
echo Installing opusscript
pause
npm install opusscript
pause
echo Installed opusscript
goto I15
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I15
set /p YN=Install os?
if /i "%YN%" == "y" goto I16
if /i "%YN%" == "n" goto I17
goto I15
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I16
echo Installing os
pause
npm install os
pause
echo Installed os
goto I17
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I17
set /p YN=Install random-hex-color?
if /i "%YN%" == "y" goto I18
if /i "%YN%" == "n" goto I19
goto I17
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I18
echo Installing random-hex-color
pause
npm install random-hex-color
pause
echo Installed random-hex-color
goto I19
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I19
set /p YN=Install rethinkdb?
if /i "%YN%" == "y" goto I20
if /i "%YN%" == "n" goto I21
goto I19
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I20
echo Installing rethinkdb
pause
npm install rethinkdb
pause
echo Installed rethinkdb
goto I21
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I21
set /p YN=Install sangoon_is_math?
if /i "%YN%" == "y" goto I22
if /i "%YN%" == "n" goto I23
goto I21
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I22
echo Installing sangoon_is_math
pause
npm install sangoon_is_math
pause
echo Installed sangoon_is_math
goto I23
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I23
set /p YN=Install yt-search?
if /i "%YN%" == "y" goto I24
if /i "%YN%" == "n" goto I25
goto I23
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I24
echo Installing yt-search
pause
npm install yt-search
pause
echo Installed yt-search
goto I25
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I25
set /p YN=Install ytdl-core?
if /i "%YN%" == "y" goto I26
if /i "%YN%" == "n" goto QUIT
goto I25
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:I26
echo Installing ytdl-core
pause
npm install ytdl-core
pause
echo Installed ytdl-core
goto QUIT
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:QUIT

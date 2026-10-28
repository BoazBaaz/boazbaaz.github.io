@echo off
set PORTFOLIO=C:\Users\BoasB\Work\Personal\boazbaaz.github.io\assets\img
set Y2A=C:\Users\BoasB\Work\BUAS\Year_2\Block_A\2425-Y2A-PR-230896\evidence\assets\media
set Y2B=C:\Users\BoasB\Work\BUAS\Year_2\Block_B\2425-Y2B-PR-230896\evidence\assets
set Y3A=C:\Users\BoasB\Work\BUAS\Year_3\Block_A\2526-Y3A-PR-230896\evidence\assets
set Y3B=C:\Users\BoasB\Work\BUAS\Year_3\Block_B\2526-Y3B-PR-230896\assets\images

echo Creating directories...
mkdir "%PORTFOLIO%\projects\bee-engine" 2>nul
mkdir "%PORTFOLIO%\projects\visual-scripting" 2>nul
mkdir "%PORTFOLIO%\blogs\ue5-source" 2>nul
mkdir "%PORTFOLIO%\blogs\cmake" 2>nul

echo.
echo Copying Bee Engine images...
copy "%Y2A%\ilo4\engine_interface.png"          "%PORTFOLIO%\projects\bee-engine\engine_interface.png"
copy "%Y2A%\ilo4\particle_system_working.gif"   "%PORTFOLIO%\projects\bee-engine\particle_system.gif"
copy "%Y2A%\ilo4\save_and_load_scene.gif"       "%PORTFOLIO%\projects\bee-engine\save_and_load.gif"

echo.
echo Copying Visual Scripting images...
copy "%Y2B%\ilo4\nodes_banner.png"              "%PORTFOLIO%\projects\visual-scripting\nodes_banner.png"
copy "%Y2B%\ilo4\node_connections.gif"           "%PORTFOLIO%\projects\visual-scripting\node_connections.gif"

echo.
echo Copying blog thumbnails...
copy "%Y3A%\show_and_tell\show_and_tell_2.png"  "%PORTFOLIO%\blogs\ue5-source\thumbnail.png"
copy "%Y3B%\cmake\bee_windows_build.png"         "%PORTFOLIO%\blogs\cmake\thumbnail.png"

echo.
echo Done. Check output above for any failed copies.
pause

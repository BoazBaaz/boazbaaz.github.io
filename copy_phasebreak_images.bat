@echo off
set PORTFOLIO=C:\Users\BoasB\Work\Personal\boazbaaz.github.io\assets\img
set Y3D=C:\Users\BoasB\Work\BUAS\Year_3\Block_D\2526-Y3D-PR-230896\assets\images

mkdir "%PORTFOLIO%\blogs\phasebreak-grid" 2>nul
mkdir "%PORTFOLIO%\projects\phasebreak" 2>nul

copy "%Y3D%\gridsystem\before_trace_channel_rework.png" "%PORTFOLIO%\blogs\phasebreak-grid\before_trace_channel_rework.png"
copy "%Y3D%\gridsystem\after_trace_channel_rework.png"  "%PORTFOLIO%\blogs\phasebreak-grid\after_trace_channel_rework.png"
copy "%Y3D%\showcase_grid_refactor_v3_2.png"            "%PORTFOLIO%\blogs\phasebreak-grid\showcase_grid_refactor_v3_2.png"

echo.
echo Done. Check above for failed copies.
pause

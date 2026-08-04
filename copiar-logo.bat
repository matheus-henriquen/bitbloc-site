@echo off
set SRC=C:\Users\mathe\.cursor\projects\c-Users-mathe-OneDrive-Documentos-bitbloc-bitbloc-store\assets\c__Users_mathe_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-641ed6a9-cad2-4c19-a453-e1efb4298ab4.png
set DEST=%~dp0assets
if not exist "%DEST%" mkdir "%DEST%"
copy /Y "%SRC%" "%DEST%\mascote-bitbloc.png"
copy /Y "%SRC%" "%DEST%\logo-mark.png"
echo.
echo Logo copiado para assets\
pause

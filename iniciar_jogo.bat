@echo off
title Missao Bebe - Cha Revelacao

:: Garante que o script rode na pasta correta onde ele está salvo
cd /d "%~dp0"

echo ===================================================
echo Iniciando o jogo Missao Bebe...
echo O seu navegador sera aberto automaticamente.
echo ===================================================

:: Abre o navegador na nova porta
start http://localhost:3033

:: Inicia o servidor Node.js
node server.js

pause
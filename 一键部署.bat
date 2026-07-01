@echo off
echo ================================
echo  商人之眼 - 一键部署到 GitHub Pages
echo ================================
echo.
echo 正在推送文件到 GitHub...
cd /d "c:\Users\LB\.trae-cn\work\6a43cba7bf57b6ba426d8b2c\merchant-eye-deploy"
git add .
git commit -m "Add GitHub Pages workflow" 2>nul
git push origin main
echo.
echo 推送完成！
echo.
echo 接下来需要开启 Pages（二选一）：
echo.
echo 方式1：等2分钟后打开 https://github.com/LB0318/merchant-eye/settings/pages
echo        Source 选 "GitHub Actions"，点 Save
echo.
echo 方式2：复制下方命令，在代理恢复后执行：
echo   curl -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/repos/LB0318/merchant-eye/pages -d "{\"source\":{\"branch\":\"main\",\"path\":\"/\"}}"
echo.
echo 你的永久链接（开启后1-2分钟生效）：
echo https://lb0318.github.io/merchant-eye/
echo.
echo ================================
pause

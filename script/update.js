var cmd = require('node-cmd');
let list = [
    `rmdir "./ts/Engine" /S /Q `,
    `rmdir "./ts/Game1" /S /Q `,
    `rmdir "./ts/Game2" /S /Q `,

    `mkdir "./ts/Engine"`,
    `mkdir "./ts/Game1"`,
    `mkdir "./ts/Game2"`,
    
    `xcopy  "D:/cocos/OpenWorldRPG/assets/Engine" "./ts/Engine" /S /E /Y`,
    `xcopy  "D:/cocos/OpenWorldRPG/assets/Game1" "./ts/Game1" /S /E /Y`,
    `xcopy  "D:/cocos/OpenWorldRPG/assets/Game2" "./ts/Game2" /S /E /Y`,
    `rmdir "./ts/Game1/Cocos" /S /Q `,
    `rmdir "./ts/Game2/Cocos" /S /Q `,
    `rmdir "./ts/Engine/Engine/Cocos" /S /Q `,

    `del /a /f /s /q  "./*.meta"`,
]
list.forEach(str => {
    cmd.runSync(str);
});
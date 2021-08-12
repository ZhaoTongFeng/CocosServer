var cmd = require('node-cmd');
let list = [
    `rmdir "D:/PHPServer/gameserver/js" /S /Q `,
    `mkdir "D:/PHPServer/gameserver/js"`,
    `xcopy  "./js" "D:/PHPServer/gameserver/js" /S /E /Y`,
]
list.forEach(str => {
    cmd.runSync(str);
});



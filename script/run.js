var cmd = require('node-cmd');
let list = [
    `npm run server`
]
list.forEach(str => {
    cmd.runSync(str);
});



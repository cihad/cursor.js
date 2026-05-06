const fs = require('fs');
let code = fs.readFileSync('src/app/(home)/ClientPage.tsx', 'utf-8');

const fpStart = code.lastIndexOf('<FloatingPlayer');
const fpEnd = code.lastIndexOf('/>') + 2;
const fpCode = code.substring(fpStart, fpEnd);

code = code.substring(0, fpStart) + code.substring(fpEnd);

const isFixedProp = "isFixed={demoState === 'running' || demoState === 'paused'}";
const newFpCode = fpCode.replace('<FloatingPlayer', `<FloatingPlayer\n        ${isFixedProp}`);

const h1End = code.indexOf('</h1>') + 5;
code = code.substring(0, h1End) + '\n          <div className="h-14 mt-4 w-full flex justify-center">\n' + newFpCode + '\n</div>' + code.substring(h1End);

fs.writeFileSync('src/app/(home)/ClientPage.tsx', code);

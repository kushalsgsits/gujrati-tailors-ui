const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'node_modules/webpack/lib/util/createHash.js');
const content = fs.readFileSync(file, 'utf8');

if (content.includes("case \"md4\":")) {
  console.log('webpack md4 patch already applied.');
  process.exit(0);
}

const patched = content.replace(
  'case "debug":',
  'case "md4":\n\t\t\treturn new BulkUpdateDecorator(require("crypto").createHash("sha256"));\n\t\tcase "debug":'
);

fs.writeFileSync(file, patched);
console.log('webpack md4 patch applied successfully.');

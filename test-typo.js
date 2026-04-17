const fs = require('fs');
const https = require('https');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(resolve);
            });
        }).on('error', function(err) {
            fs.unlink(dest);
            reject(err);
        });
    });
}

(async () => {
    if (!fs.existsSync('index.aff')) await download('https://cdn.jsdelivr.net/npm/dictionary-es@2.0.1/index.aff', 'index.aff');
    if (!fs.existsSync('index.dic')) await download('https://cdn.jsdelivr.net/npm/dictionary-es@2.0.1/index.dic', 'index.dic');
    
    // Check with the actual lib
    const Typo = require('/Users/td01/Documents/PROYECTOS IA/WEB TARJETAS Y PAGINAS DE INICIO/node_modules/typo-js/typo.js').default || require('typo-js');
    const affData = fs.readFileSync('index.aff', 'utf8');
    const dicData = fs.readFileSync('index.dic', 'utf8');
    
    const typo = new Typo('es', affData, dicData);
    
    console.log("hola:", typo.check("hola")); // true
    console.log("holla:", typo.check("holla")); // false?
    console.log("arbol:", typo.check("arbol")); // false?
    console.log("árbol:", typo.check("árbol")); // true?
    console.log("Semana:", typo.check("Semana")); // true?
})();

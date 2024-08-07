const { Console } = require('console');
const express = require('express');
const { write } = require('fs');
const { title } = require('process');
const puppeteer = require('puppeteer');
var resemble = require('resemblejs');
const fs = require('fs');
const { pseudoRandomBytes } = require('crypto');
const { pipeline } = require('stream');

const EMAIL = process.env.EMAIL;
const SENHA = process.env.SENHA;

const app = express();
const port = 5501;

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});

async function selecionaPlanilha(nomePlanilha) {
    await page.keyboard.press('Alt');
        await page.waitForTimeout(5000);
        await page.keyboard.press('c');
        await page.waitForTimeout(2000);
        await page.keyboard.press('f');
        await page.waitForTimeout(2000);
        await page.keyboard.press('d');
        await page.waitForTimeout(2000);
        await page.keyboard.press('g');
        await page.waitForTimeout(2000)
        for (let i = 0; i < 30; i++) {
            await page.keyboard.press('Backspace')
        }
        await page.waitForTimeout(2000);
        await page.keyboard.type(nomePlanilha);
        await page.waitForTimeout(2000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
}

async function zoom(zoom) {
    await page.waitForTimeout(4000);
    await page.keyboard.press('Alt');
    await page.waitForTimeout(2000);
    await page.keyboard.press('k');
    await page.waitForTimeout(2000);
    await page.keyboard.press('b');
    await page.waitForTimeout(2000);
    await page.keyboard.press('o');
    await page.waitForTimeout(4000);
    await page.keyboard.type(zoom);
    await page.waitForTimeout(4000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
}

async function faixaOpcoes(opcao) {
    await page.keyboard.press('Alt');
    await page.waitForTimeout(5000);
    await page.keyboard.press('z');
    await page.waitForTimeout(2000);
    await page.keyboard.press('r');
    await page.waitForTimeout(2000);
    await page.keyboard.press(opcao);
    await page.waitForTimeout(5000);
}

async function funcaoAsync() {
    let browser;
    let page;
    let url;
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--start-fullscreen']
        });
        page = await browser.newPage();

        url = 'https://onedrive.live.com/edit.aspx?resid=231435C3B93DD1FB!1152&cid=231435c3b93dd1fb&CT=1695255808361&OR=ItemsView';

        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(5000);
        await page.keyboard.type(EMAIL);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(10000);
        await page.keyboard.type(SENHA);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(4000);
        const x = await page.screenshot({});
        await page.waitForTimeout(10000);
        await page.keyboard.press('a');
        await page.waitForTimeout(6000);
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(2000);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(10000);

        selecionaPlanilha("Painel Malte_Maltose!a1");

        for (let i = 0; i < 9; i++) {
            await page.keyboard.press('ArrowDown');
        }

        //Definir zoom
        zoom('45');

        //tirar faixa de opções
        faixaOpcoes('a');

        const malte = await page.screenshot({ 
            clip: {
                x: 0,
                y: 85,
                width: 800,
                height: 444
            }
        });
        console.log(malte);

        await page.waitForTimeout(5000);

        //selecionar planilha, células a1 e z86
        selecionaPlanilha("Painel!a1");

        zoom('34');

        //tirar faixa de opções
        faixaOpcoes('o');
        faixaOpcoes('a');

        const painel2 = await page.screenshot({ 
            clip: {
                x: 0,
                y: 85,
                width: 784,
                height: 291
            }
        });
        console.log(painel2);

        await page.waitForTimeout(5000);

        //Definir zoom
        zoom('50')
    
        selecionaPlanilha("Painel!z86")
        
        //tirar faixa de opções
        for (let i = 0; i == 4; i++) {
            faixaOpcoes('o');
        }
        faixaOpcoes('a');
        
        const painel = await page.screenshot({ 
            clip: {
                x: 0,
                y: 85,
                width: 800,
                height: 260
            }
        });
        console.log(painel);
        
        await page.waitForTimeout(5000);
        await browser.close();

        // verificar para enviar a imagem correta 
        
        function compara() {
            var imagem = fs.readFileSync('malte - Copia.png');
            var imagem1 = fs.readFileSync('painel - Copia.png');
            var imagem2 = fs.readFileSync('painel2 - Copia.jpg');
            resemble(imagem).compareTo(malte).onComplete(function(data) {
                console.log(data);
                if (data.misMatchPercentage < 10) {
                    require('fs').writeFileSync('malte.png', malte);
                    // app.get('/', (req, res) => {
                    //     res.send(`<img src="data:image/png;base64,${malte}">`);
                    // });
                    console.log("ingual malte");
                } else {
                    console.log("desingual malte");
                }
            })
            resemble(imagem1).compareTo(painel).onComplete(function(data) {
                console.log(data);
                if (data.misMatchPercentage > 24) {
                    require('fs').writeFileSync('painel.png', painel);
                    // app.get('/', (req, res) => {
                    //     res.send(`<img src="data:image/png;base64,${painel}">`);
                    // });
                    console.log("ingual painel");
                } else {
                    console.log("desingual painel");
                }
            })
            resemble(imagem2).compareTo(painel2).onComplete(function(data) {
                console.log(data);
                if (data.misMatchPercentage < 32) {
                    require('fs').writeFileSync('painel2.png', painel2);
                    // app.get('/', (req, res) => {
                    //     res.send(`<img src="data:image/png;base64,${painel2}">`);
                    // });
                    console.log("ingual painel2");
                } else {
                    console.log("desingual painel2");
                }
            })
        }

        compara();

        async function uploadImage(filePath, existingImageId) {
            const fileBuffer = fs.readFileSync(filePath);
            const base64Image = fileBuffer.toString('base64');

            var form = new FormData();
            form.append("image", base64Image);

            if(existingImageId) {
                form.append("edit", existingImageId)
            }
        
            var url = "https://api.imgbb.com/1/upload?key=2c08861c58e5d8eb77081fc7f0b1015c";
            const config = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Connection: "keep-alive",
                },
                body: form,
            };
        
            const response = await fetch(url, config);
            if (!response.ok) {
                const message = await response.text();
                console.error('Error:', response.status, message);
                return;
            }
            const json = await response.json();
        
            console.log(response);
            console.log(json.data.url);
            console.log(filePath);
        }

        uploadImage('malte.png', '0be124f74837');
        uploadImage('painel.png', '81808aec1db7');
        uploadImage('painel2.png', '769c2237308a');       

    } catch (error) {
        console.log('Erro ao executar funcaoAsync: ', error);
    } finally {
        if(browser) {
            await browser.close();
        }
    }
}

funcaoAsync();

// async function loop() {
//     while (true) {
//         await funcaoAsync();
//         await new Promise(resolve => setTimeout(resolve, 40000));
//     }
// }

// loop();
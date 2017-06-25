/* eslint-env browser, webextensions */

(async function main(){
    const mountpoint = document.getElementById('js-mountpoint');
    mountpoint!.innerHTML = 'This is experimental implementations';
})().catch(console.error);

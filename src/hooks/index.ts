/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
// @ts-ignore
// @ts-nocheck

export function generateRandomRGB(type:string = 'array' | 'string') {
    try {
        const num = Math.round(0xffffff * Math.random());
        const r = num >> 16;
        const g = num >> 8 & 255;
        const b = num & 255;
        if (type === 'string')
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        else
            return [r, g, b];
    } catch (err) {
        return [255, 255, 255];
    }
}


export function transformHexToRGB(hex: string, typeReturn = 'rgb' | 'object' | 'array') {
    try {
        hex = hex.replace('#', '')
        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        const arrByte = new Uint8Array(arrBuff);

        if (typeReturn === 'object')
            return { r: arrByte[1], g: arrByte[2], b: arrByte[3] }
        else if (typeReturn === 'array')
            return [arrByte[1], arrByte[2], arrByte[3]]
        else
            return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
    } catch (err) {
        return null
    }
}



export const popupCenter = ({ url, title, w, h, content }) => {

    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
  
    // eslint-disable-next-line no-restricted-globals
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    // eslint-disable-next-line no-restricted-globals
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  
    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    )

    if (content)
      newWindow.document.write(content)
  
    if (window.focus) newWindow.focus();
  }
  
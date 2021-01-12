(()=>{"use strict";const t="Invalid signature";class e{constructor(){this.crc=-1,this.table=(()=>{const t=[];for(let e=0;e<256;e++){let n=e;for(let t=0;t<8;t++)1&n?n=n>>>1^3988292384:n>>>=1;t[e]=n}return t})()}append(t){const e=this.table;let n=0|this.crc;for(let p=0,r=0|t.length;p<r;p++)n=n>>>8^e[255&(n^t[p])];this.crc=n}get(){return~this.crc}}const n={init:function(t){t.scripts&&t.scripts.length>0&&(importScripts.apply(void 0,t.scripts),r||"function"!=typeof createShimCodecs||(r=!0,createShimCodecs()));const n=t.options;p={codecType:n.codecType,outputSigned:n.outputSigned,outputCompressed:n.outputCompressed,outputEncrypted:n.outputEncrypted,outputPassword:n.outputPassword,inputSigned:n.inputSigned,inputSignature:n.inputSignature,inputCompressed:n.inputCompressed,inputEncrypted:n.inputEncrypted,inputPassword:n.inputPassword,inputCrc32:n.inputSigned&&new e,outputCrc32:n.outputSigned&&new e,deflater:"deflate"==n.codecType&&new ZipDeflater,inflater:"inflate"==n.codecType&&new ZipInflater,decrypt:n.inputEncrypted&&new ZipDecrypt(n.inputPassword,n.inputSigned),encrypt:n.outputEncrypted&&new ZipEncrypt(n.outputPassword)}},append:async function(t){const e=new Uint8Array(t.data);let n=e;p.inputEncrypted&&(n=await p.decrypt.append(n));p.inputCompressed&&n.length&&(n=await p.inflater.append(n));!p.inputEncrypted&&p.inputSigned&&p.inputCrc32.append(n);p.outputCompressed&&n.length&&(n=await p.deflater.append(e));p.outputEncrypted?n=await p.encrypt.append(n):p.outputSigned&&p.outputCrc32.append(e);return{data:n}},flush:async function(){let e,n=new Uint8Array(0);if(p.inputEncrypted){const e=await p.decrypt.flush();if(!e.valid)throw new Error(t);n=e.data}else if(p.inputSigned){const n=new DataView(new Uint8Array(4).buffer);if(e=p.inputCrc32.get(),n.setUint32(0,e),p.inputSignature!=n.getUint32(0))throw new Error(t)}p.inputCompressed&&(n.length&&(n=await p.inflater.append(n)),await p.inflater.flush());p.outputCompressed&&(n=await p.deflater.flush());if(p.outputEncrypted){n=await p.encrypt.append(n);const t=await p.encrypt.flush();e=t.signature;const r=new Uint8Array(n.length+t.data.length);r.set(n,0),r.set(t.data,n.length),n=r}else p.outputSigned&&(e=p.outputCrc32.get());return{data:n,signature:e}}};let p,r;addEventListener("message",(async t=>{const e=t.data,p=e.type,r=n[p];if(r)try{const t=await r(e)||{};if(t.type=e.type,t.data)try{postMessage(t,[t.data.buffer])}catch(e){postMessage(t)}else postMessage(t)}catch(t){postMessage({type:p,error:{message:t.message,stack:t.stack}})}}))})();

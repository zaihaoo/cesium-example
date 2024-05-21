/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.114
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as F}from"./chunk-Y27LWH3W.js";import{a as R}from"./chunk-ON3Y6OZW.js";import{a as u}from"./chunk-72JWF3LF.js";import{b as S}from"./chunk-3Z2AZRQC.js";import{d as H,e as _}from"./chunk-A5XXOFX2.js";var Y=1953029805,Q=2917034100;function B(e,r){if(B.passThroughDataForTesting)return r;S.typeOf.object("key",e),S.typeOf.object("data",r);let o=e.byteLength;if(o===0||o%4!==0)throw new u("The length of key must be greater than 0 and a multiple of 4.");let n=new DataView(r),t=n.getUint32(0,!0);if(t===Y||t===Q)return r;let s=new DataView(e),i=0,a=r.byteLength,c=a-a%8,p=o,f,h=8;for(;i<c;)for(h=(h+8)%24,f=h;i<c&&f<p;)n.setUint32(i,n.getUint32(i,!0)^s.getUint32(f,!0),!0),n.setUint32(i+4,n.getUint32(i+4,!0)^s.getUint32(f+4,!0),!0),i+=8,f+=24;if(i<a)for(f>=p&&(h=(h+8)%24,f=h);i<a;)n.setUint8(i,n.getUint8(i)^s.getUint8(f)),i++,f++}B.passThroughDataForTesting=!1;var O=B;function j(e,r){return(e&r)!==0}var T=j;var q=[1,2,4,8],z=15,W=16,J=64,K=128;function d(e,r,o,n,t,s){this._bits=e,this.cnodeVersion=r,this.imageryVersion=o,this.terrainVersion=n,this.imageryProvider=t,this.terrainProvider=s,this.ancestorHasTerrain=!1,this.terrainState=void 0}d.clone=function(e,r){return _(r)?(r._bits=e._bits,r.cnodeVersion=e.cnodeVersion,r.imageryVersion=e.imageryVersion,r.terrainVersion=e.terrainVersion,r.imageryProvider=e.imageryProvider,r.terrainProvider=e.terrainProvider):r=new d(e._bits,e.cnodeVersion,e.imageryVersion,e.terrainVersion,e.imageryProvider,e.terrainProvider),r.ancestorHasTerrain=e.ancestorHasTerrain,r.terrainState=e.terrainState,r};d.prototype.setParent=function(e){this.ancestorHasTerrain=e.ancestorHasTerrain||this.hasTerrain()};d.prototype.hasSubtree=function(){return T(this._bits,W)};d.prototype.hasImagery=function(){return T(this._bits,J)};d.prototype.hasTerrain=function(){return T(this._bits,K)};d.prototype.hasChildren=function(){return T(this._bits,z)};d.prototype.hasChild=function(e){return T(this._bits,q[e])};d.prototype.getChildBitmask=function(){return this._bits&z};var L=d;var N=H(F(),1);var y=Uint16Array.BYTES_PER_ELEMENT,m=Int32Array.BYTES_PER_ELEMENT,E=Uint32Array.BYTES_PER_ELEMENT,g={METADATA:0,TERRAIN:1,DBROOT:2};g.fromString=function(e){if(e==="Metadata")return g.METADATA;if(e==="Terrain")return g.TERRAIN;if(e==="DbRoot")return g.DBROOT};function X(e,r){let o=g.fromString(e.type),n=e.buffer;O(e.key,n);let t=it(n);n=t.buffer;let s=t.length;switch(o){case g.METADATA:return $(n,s,e.quadKey);case g.TERRAIN:return nt(n,s,r);case g.DBROOT:return r.push(n),{buffer:n}}}var Z=32301;function $(e,r,o){let n=new DataView(e),t=0,s=n.getUint32(t,!0);if(t+=E,s!==Z)throw new u("Invalid magic");let i=n.getUint32(t,!0);if(t+=E,i!==1)throw new u("Invalid data type. Must be 1 for QuadTreePacket");let a=n.getUint32(t,!0);if(t+=E,a!==2)throw new u("Invalid QuadTreePacket version. Only version 2 is supported.");let c=n.getInt32(t,!0);t+=m;let p=n.getInt32(t,!0);if(t+=m,p!==32)throw new u("Invalid instance size.");let f=n.getInt32(t,!0);t+=m;let h=n.getInt32(t,!0);t+=m;let G=n.getInt32(t,!0);if(t+=m,f!==c*p+t)throw new u("Invalid dataBufferOffset");if(f+h+G!==r)throw new u("Invalid packet offsets");let v=[];for(let I=0;I<c;++I){let b=n.getUint8(t);++t,++t;let k=n.getUint16(t,!0);t+=y;let P=n.getUint16(t,!0);t+=y;let l=n.getUint16(t,!0);t+=y,t+=y,t+=y,t+=m,t+=m,t+=8;let w=n.getUint8(t++),V=n.getUint8(t++);t+=y,v.push(new L(b,k,P,l,w,V))}let U=[],M=0;function x(I,b,k){let P=!1;if(k===4){if(b.hasSubtree())return;P=!0}for(let l=0;l<4;++l){let w=I+l.toString();if(P)U[w]=null;else if(k<4)if(!b.hasChild(l))U[w]=null;else{if(M===c){console.log("Incorrect number of instances");return}let V=v[M++];U[w]=V,x(w,V,k+1)}}}let A=0,D=v[M++];return o===""?++A:U[o]=D,x(o,D,A),U}var tt=5,et=4;function nt(e,r,o){let n=new DataView(e),t=function(a){for(let c=0;c<et;++c){let p=n.getUint32(a,!0);if(a+=E,a+=p,a>r)throw new u("Malformed terrain packet found.")}return a},s=0,i=[];for(;i.length<tt;){let a=s;s=t(s);let c=e.slice(a,s);o.push(c),i.push(c)}return i}var C=1953029805,rt=2917034100;function it(e){let r=new DataView(e),o=0,n=r.getUint32(o,!0);if(o+=E,n!==C&&n!==rt)throw new u("Invalid magic");let t=r.getUint32(o,n===C);o+=E;let s=new Uint8Array(e,o),i=N.default.inflate(s);if(i.length!==t)throw new u("Size of packet doesn't match header");return i}var lt=R(X);export{lt as default};

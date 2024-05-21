/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.99
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
define(["exports","./Matrix3-65932166","./defaultValue-0ab18f7d","./Transforms-f9e365d3","./Math-422cd179","./Matrix2-82a3f96e"],(function(t,n,a,e,o,r){"use strict";const s=Math.cos,i=Math.sin,c=Math.sqrt,g={computePosition:function(t,n,e,o,r,g,u){const h=n.radiiSquared,l=t.nwCorner,C=t.boundingRectangle;let d=l.latitude-t.granYCos*o+r*t.granXSin;const S=s(d),M=i(d),w=h.z*M;let X=l.longitude+o*t.granYSin+r*t.granXCos;const Y=S*s(X),f=S*i(X),m=h.x*Y,p=h.y*f,x=c(m*Y+p*f+w*M);if(g.x=m/x,g.y=p/x,g.z=w/x,e){const n=t.stNwCorner;a.defined(n)?(d=n.latitude-t.stGranYCos*o+r*t.stGranXSin,X=n.longitude+o*t.stGranYSin+r*t.stGranXCos,u.x=(X-t.stWest)*t.lonScalar,u.y=(d-t.stSouth)*t.latScalar):(u.x=(X-C.west)*t.lonScalar,u.y=(d-C.south)*t.latScalar)}}},u=new r.Matrix2;let h=new n.Cartesian3;const l=new n.Cartographic;let C=new n.Cartesian3;const d=new e.GeographicProjection;function S(t,a,e,o,s,i,c){const g=Math.cos(a),l=o*g,S=e*g,M=Math.sin(a),w=o*M,X=e*M;h=d.project(t,h),h=n.Cartesian3.subtract(h,C,h);const Y=r.Matrix2.fromRotation(a,u);h=r.Matrix2.multiplyByVector(Y,h,h),h=n.Cartesian3.add(h,C,h),i-=1,c-=1;const f=(t=d.unproject(h,t)).latitude,m=f+i*X,p=f-l*c,x=f-l*c+i*X,G=Math.max(f,m,p,x),R=Math.min(f,m,p,x),y=t.longitude,O=y+i*S,P=y+c*w,W=y+c*w+i*S;return{north:G,south:R,east:Math.max(y,O,P,W),west:Math.min(y,O,P,W),granYCos:l,granYSin:w,granXCos:S,granXSin:X,nwCorner:t}}g.computeOptions=function(t,n,a,e,s,i,c){let g,u=t.east,h=t.west,M=t.north,w=t.south,X=!1,Y=!1;M===o.CesiumMath.PI_OVER_TWO&&(X=!0),w===-o.CesiumMath.PI_OVER_TWO&&(Y=!0);const f=M-w;g=h>u?o.CesiumMath.TWO_PI-h+u:u-h;const m=Math.ceil(g/n)+1,p=Math.ceil(f/n)+1,x=g/(m-1),G=f/(p-1),R=r.Rectangle.northwest(t,i),y=r.Rectangle.center(t,l);0===a&&0===e||(y.longitude<R.longitude&&(y.longitude+=o.CesiumMath.TWO_PI),C=d.project(y,C));const O=G,P=x,W=r.Rectangle.clone(t,s),_={granYCos:O,granYSin:0,granXCos:P,granXSin:0,nwCorner:R,boundingRectangle:W,width:m,height:p,northCap:X,southCap:Y};if(0!==a){const t=S(R,a,x,G,0,m,p);M=t.north,w=t.south,u=t.east,h=t.west,_.granYCos=t.granYCos,_.granYSin=t.granYSin,_.granXCos=t.granXCos,_.granXSin=t.granXSin,W.north=M,W.south=w,W.east=u,W.west=h}if(0!==e){a-=e;const t=r.Rectangle.northwest(W,c),n=S(t,a,x,G,0,m,p);_.stGranYCos=n.granYCos,_.stGranXCos=n.granXCos,_.stGranYSin=n.granYSin,_.stGranXSin=n.granXSin,_.stNwCorner=t,_.stWest=n.west,_.stSouth=n.south}return _};var M=g;t.RectangleGeometryLibrary=M}));

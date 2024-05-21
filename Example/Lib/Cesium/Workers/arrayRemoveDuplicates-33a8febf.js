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
define(["exports","./defaultValue-0ab18f7d","./Math-422cd179"],(function(e,n,d){"use strict";const t=d.CesiumMath.EPSILON10;e.arrayRemoveDuplicates=function(e,d,i,f){if(!n.defined(e))return;i=n.defaultValue(i,!1);const u=n.defined(f),s=e.length;if(s<2)return e;let l,r,a,c=e[0],h=0,o=-1;for(l=1;l<s;++l)r=e[l],d(c,r,t)?(n.defined(a)||(a=e.slice(0,l),h=l-1,o=0),u&&f.push(l)):(n.defined(a)&&(a.push(r),h=l,u&&(o=f.length)),c=r);return i&&d(e[0],e[s-1],t)&&(u&&(n.defined(a)?f.splice(o,0,h):f.push(s-1)),n.defined(a)?a.length-=1:a=e.slice(0,-1)),n.defined(a)?a:e}}));

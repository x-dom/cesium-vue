/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
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
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["exports","./when-a55a8a4c","./Check-bc1d37d9","./Math-73a8bd13"],function(e,R,i,b){"use strict";function V(e,t,n){this.x=R.defaultValue(e,0),this.y=R.defaultValue(t,0),this.z=R.defaultValue(n,0)}V.fromSpherical=function(e,t){R.defined(t)||(t=new V);var n=e.clock,a=e.cone,r=R.defaultValue(e.magnitude,1),i=r*Math.sin(a);return t.x=i*Math.cos(n),t.y=i*Math.sin(n),t.z=r*Math.cos(a),t},V.fromElements=function(e,t,n,a){return R.defined(a)?(a.x=e,a.y=t,a.z=n,a):new V(e,t,n)},V.fromCartesian4=V.clone=function(e,t){if(R.defined(e))return R.defined(t)?(t.x=e.x,t.y=e.y,t.z=e.z,t):new V(e.x,e.y,e.z)},V.packedLength=3,V.pack=function(e,t,n){return n=R.defaultValue(n,0),t[n++]=e.x,t[n++]=e.y,t[n]=e.z,t},V.unpack=function(e,t,n){return t=R.defaultValue(t,0),R.defined(n)||(n=new V),n.x=e[t++],n.y=e[t++],n.z=e[t],n},V.packArray=function(e,t){var n=e.length,a=3*n;if(R.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new i.DeveloperError("If result is a typed array, it must have exactly array.length * 3 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var r=0;r<n;++r)V.pack(e[r],t,3*r);return t},V.unpackArray=function(e,t){var n=e.length;R.defined(t)?t.length=n/3:t=new Array(n/3);for(var a=0;a<n;a+=3){var r=a/3;t[r]=V.unpack(e,a,t[r])}return t},V.fromArray=V.unpack,V.maximumComponent=function(e){return Math.max(e.x,e.y,e.z)},V.minimumComponent=function(e){return Math.min(e.x,e.y,e.z)},V.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n.z=Math.min(e.z,t.z),n},V.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n.z=Math.max(e.z,t.z),n},V.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y+e.z*e.z},V.magnitude=function(e){return Math.sqrt(V.magnitudeSquared(e))};var n=new V;V.distance=function(e,t){return V.subtract(e,t,n),V.magnitude(n)},V.distanceSquared=function(e,t){return V.subtract(e,t,n),V.magnitudeSquared(n)},V.normalize=function(e,t){var n=V.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t.z=e.z/n,t},V.dot=function(e,t){return e.x*t.x+e.y*t.y+e.z*t.z},V.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n.z=e.z*t.z,n},V.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n.z=e.z/t.z,n},V.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n.z=e.z+t.z,n},V.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n.z=e.z-t.z,n},V.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n.z=e.z*t,n},V.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n.z=e.z/t,n},V.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t.z=-e.z,t},V.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t.z=Math.abs(e.z),t};var r=new V;V.lerp=function(e,t,n,a){return V.multiplyByScalar(t,n,r),a=V.multiplyByScalar(e,1-n,a),V.add(r,a,a)};var u=new V,o=new V;V.angleBetween=function(e,t){V.normalize(e,u),V.normalize(t,o);var n=V.dot(u,o),a=V.magnitude(V.cross(u,o,u));return Math.atan2(a,n)};var a=new V;V.mostOrthogonalAxis=function(e,t){var n=V.normalize(e,a);return V.abs(n,n),t=n.x<=n.y?n.x<=n.z?V.clone(V.UNIT_X,t):V.clone(V.UNIT_Z,t):n.y<=n.z?V.clone(V.UNIT_Y,t):V.clone(V.UNIT_Z,t)},V.projectVector=function(e,t,n){var a=V.dot(e,t)/V.dot(t,t);return V.multiplyByScalar(t,a,n)},V.equals=function(e,t){return e===t||R.defined(e)&&R.defined(t)&&e.x===t.x&&e.y===t.y&&e.z===t.z},V.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]&&e.z===t[n+2]},V.equalsEpsilon=function(e,t,n,a){return e===t||R.defined(e)&&R.defined(t)&&b.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&b.CesiumMath.equalsEpsilon(e.y,t.y,n,a)&&b.CesiumMath.equalsEpsilon(e.z,t.z,n,a)},V.cross=function(e,t,n){var a=e.x,r=e.y,i=e.z,u=t.x,o=t.y,d=t.z,s=r*d-i*o,h=i*u-a*d,l=a*o-r*u;return n.x=s,n.y=h,n.z=l,n},V.midpoint=function(e,t,n){return n.x=.5*(e.x+t.x),n.y=.5*(e.y+t.y),n.z=.5*(e.z+t.z),n},V.fromDegrees=function(e,t,n,a,r){return e=b.CesiumMath.toRadians(e),t=b.CesiumMath.toRadians(t),V.fromRadians(e,t,n,a,r)};var d=new V,s=new V,h=new V(40680631590769,40680631590769,40408299984661.445);V.fromRadians=function(e,t,n,a,r){n=R.defaultValue(n,0);var i=R.defined(a)?a.radiiSquared:h,u=Math.cos(t);d.x=u*Math.cos(e),d.y=u*Math.sin(e),d.z=Math.sin(t),d=V.normalize(d,d),V.multiplyComponents(i,d,s);var o=Math.sqrt(V.dot(d,s));return s=V.divideByScalar(s,o,s),d=V.multiplyByScalar(d,n,d),R.defined(r)||(r=new V),V.add(s,d,r)},V.fromDegreesArray=function(e,t,n){var a=e.length;R.defined(n)?n.length=a/2:n=new Array(a/2);for(var r=0;r<a;r+=2){var i=e[r],u=e[r+1],o=r/2;n[o]=V.fromDegrees(i,u,0,t,n[o])}return n},V.fromRadiansArray=function(e,t,n){var a=e.length;R.defined(n)?n.length=a/2:n=new Array(a/2);for(var r=0;r<a;r+=2){var i=e[r],u=e[r+1],o=r/2;n[o]=V.fromRadians(i,u,0,t,n[o])}return n},V.fromDegreesArrayHeights=function(e,t,n){var a=e.length;R.defined(n)?n.length=a/3:n=new Array(a/3);for(var r=0;r<a;r+=3){var i=e[r],u=e[r+1],o=e[r+2],d=r/3;n[d]=V.fromDegrees(i,u,o,t,n[d])}return n},V.fromRadiansArrayHeights=function(e,t,n){var a=e.length;R.defined(n)?n.length=a/3:n=new Array(a/3);for(var r=0;r<a;r+=3){var i=e[r],u=e[r+1],o=e[r+2],d=r/3;n[d]=V.fromRadians(i,u,o,t,n[d])}return n},V.ZERO=Object.freeze(new V(0,0,0)),V.UNIT_X=Object.freeze(new V(1,0,0)),V.UNIT_Y=Object.freeze(new V(0,1,0)),V.UNIT_Z=Object.freeze(new V(0,0,1)),V.prototype.clone=function(e){return V.clone(this,e)},V.prototype.equals=function(e){return V.equals(this,e)},V.prototype.equalsEpsilon=function(e,t,n){return V.equalsEpsilon(this,e,t,n)},V.prototype.toString=function(){return"("+this.x+", "+this.y+", "+this.z+")"};var I=new V,E=new V;function l(e,t,n,a,r){var i=e.x,u=e.y,o=e.z,d=t.x,s=t.y,h=t.z,l=i*i*d*d,f=u*u*s*s,c=o*o*h*h,m=l+f+c,y=Math.sqrt(1/m),p=V.multiplyByScalar(e,y,I);if(m<a)return isFinite(y)?V.clone(p,r):void 0;var g=n.x,x=n.y,M=n.z,w=E;w.x=p.x*g*2,w.y=p.y*x*2,w.z=p.z*M*2;var v,_,C,z,S,q,O,T=(1-y)*V.magnitude(e)/(.5*V.magnitude(w)),A=0;do{A=(v=l*(S=(_=1/(1+(T-=A)*g))*_)+f*(q=(C=1/(1+T*x))*C)+c*(O=(z=1/(1+T*M))*z)-1)/(-2*(l*(S*_)*g+f*(q*C)*x+c*(O*z)*M))}while(Math.abs(v)>b.CesiumMath.EPSILON12);return R.defined(r)?(r.x=i*_,r.y=u*C,r.z=o*z,r):new V(i*_,u*C,o*z)}function f(e,t,n){this.longitude=R.defaultValue(e,0),this.latitude=R.defaultValue(t,0),this.height=R.defaultValue(n,0)}f.fromRadians=function(e,t,n,a){return n=R.defaultValue(n,0),R.defined(a)?(a.longitude=e,a.latitude=t,a.height=n,a):new f(e,t,n)},f.fromDegrees=function(e,t,n,a){return e=b.CesiumMath.toRadians(e),t=b.CesiumMath.toRadians(t),f.fromRadians(e,t,n,a)};var c=new V,m=new V,y=new V,p=new V(1/6378137,1/6378137,1/6356752.314245179),g=new V(1/40680631590769,1/40680631590769,1/40408299984661.445),x=b.CesiumMath.EPSILON1;function M(e,t,n,a){t=R.defaultValue(t,0),n=R.defaultValue(n,0),a=R.defaultValue(a,0),e._radii=new V(t,n,a),e._radiiSquared=new V(t*t,n*n,a*a),e._radiiToTheFourth=new V(t*t*t*t,n*n*n*n,a*a*a*a),e._oneOverRadii=new V(0===t?0:1/t,0===n?0:1/n,0===a?0:1/a),e._oneOverRadiiSquared=new V(0===t?0:1/(t*t),0===n?0:1/(n*n),0===a?0:1/(a*a)),e._minimumRadius=Math.min(t,n,a),e._maximumRadius=Math.max(t,n,a),e._centerToleranceSquared=b.CesiumMath.EPSILON1,0!==e._radiiSquared.z&&(e._squaredXOverSquaredZ=e._radiiSquared.x/e._radiiSquared.z)}function w(e,t,n){this._radii=void 0,this._radiiSquared=void 0,this._radiiToTheFourth=void 0,this._oneOverRadii=void 0,this._oneOverRadiiSquared=void 0,this._minimumRadius=void 0,this._maximumRadius=void 0,this._centerToleranceSquared=void 0,this._squaredXOverSquaredZ=void 0,M(this,e,t,n)}f.fromCartesian=function(e,t,n){var a=R.defined(t)?t.oneOverRadii:p,r=R.defined(t)?t.oneOverRadiiSquared:g,i=l(e,a,r,R.defined(t)?t._centerToleranceSquared:x,m);if(R.defined(i)){var u=V.multiplyComponents(i,r,c);u=V.normalize(u,u);var o=V.subtract(e,i,y),d=Math.atan2(u.y,u.x),s=Math.asin(u.z),h=b.CesiumMath.sign(V.dot(o,e))*V.magnitude(o);return R.defined(n)?(n.longitude=d,n.latitude=s,n.height=h,n):new f(d,s,h)}},f.toCartesian=function(e,t,n){return V.fromRadians(e.longitude,e.latitude,e.height,t,n)},f.clone=function(e,t){if(R.defined(e))return R.defined(t)?(t.longitude=e.longitude,t.latitude=e.latitude,t.height=e.height,t):new f(e.longitude,e.latitude,e.height)},f.equals=function(e,t){return e===t||R.defined(e)&&R.defined(t)&&e.longitude===t.longitude&&e.latitude===t.latitude&&e.height===t.height},f.equalsEpsilon=function(e,t,n){return e===t||R.defined(e)&&R.defined(t)&&Math.abs(e.longitude-t.longitude)<=n&&Math.abs(e.latitude-t.latitude)<=n&&Math.abs(e.height-t.height)<=n},f.ZERO=Object.freeze(new f(0,0,0)),f.prototype.clone=function(e){return f.clone(this,e)},f.prototype.equals=function(e){return f.equals(this,e)},f.prototype.equalsEpsilon=function(e,t){return f.equalsEpsilon(this,e,t)},f.prototype.toString=function(){return"("+this.longitude+", "+this.latitude+", "+this.height+")"},Object.defineProperties(w.prototype,{radii:{get:function(){return this._radii}},radiiSquared:{get:function(){return this._radiiSquared}},radiiToTheFourth:{get:function(){return this._radiiToTheFourth}},oneOverRadii:{get:function(){return this._oneOverRadii}},oneOverRadiiSquared:{get:function(){return this._oneOverRadiiSquared}},minimumRadius:{get:function(){return this._minimumRadius}},maximumRadius:{get:function(){return this._maximumRadius}}}),w.clone=function(e,t){if(R.defined(e)){var n=e._radii;return R.defined(t)?(V.clone(n,t._radii),V.clone(e._radiiSquared,t._radiiSquared),V.clone(e._radiiToTheFourth,t._radiiToTheFourth),V.clone(e._oneOverRadii,t._oneOverRadii),V.clone(e._oneOverRadiiSquared,t._oneOverRadiiSquared),t._minimumRadius=e._minimumRadius,t._maximumRadius=e._maximumRadius,t._centerToleranceSquared=e._centerToleranceSquared,t):new w(n.x,n.y,n.z)}},w.fromCartesian3=function(e,t){return R.defined(t)||(t=new w),R.defined(e)&&M(t,e.x,e.y,e.z),t},w.WGS84=Object.freeze(new w(6378137,6378137,6356752.314245179)),w.UNIT_SPHERE=Object.freeze(new w(1,1,1)),w.MOON=Object.freeze(new w(b.CesiumMath.LUNAR_RADIUS,b.CesiumMath.LUNAR_RADIUS,b.CesiumMath.LUNAR_RADIUS)),w.prototype.clone=function(e){return w.clone(this,e)},w.packedLength=V.packedLength,w.pack=function(e,t,n){return n=R.defaultValue(n,0),V.pack(e._radii,t,n),t},w.unpack=function(e,t,n){t=R.defaultValue(t,0);var a=V.unpack(e,t);return w.fromCartesian3(a,n)},w.prototype.geocentricSurfaceNormal=V.normalize,w.prototype.geodeticSurfaceNormalCartographic=function(e,t){var n=e.longitude,a=e.latitude,r=Math.cos(a),i=r*Math.cos(n),u=r*Math.sin(n),o=Math.sin(a);return R.defined(t)||(t=new V),t.x=i,t.y=u,t.z=o,V.normalize(t,t)},w.prototype.geodeticSurfaceNormal=function(e,t){return R.defined(t)||(t=new V),t=V.multiplyComponents(e,this._oneOverRadiiSquared,t),V.normalize(t,t)};var v=new V,_=new V;w.prototype.cartographicToCartesian=function(e,t){var n=v,a=_;this.geodeticSurfaceNormalCartographic(e,n),V.multiplyComponents(this._radiiSquared,n,a);var r=Math.sqrt(V.dot(n,a));return V.divideByScalar(a,r,a),V.multiplyByScalar(n,e.height,n),R.defined(t)||(t=new V),V.add(a,n,t)},w.prototype.cartographicArrayToCartesianArray=function(e,t){var n=e.length;R.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;a++)t[a]=this.cartographicToCartesian(e[a],t[a]);return t};var C=new V,z=new V,S=new V;function q(e,t,n,a){this.west=R.defaultValue(e,0),this.south=R.defaultValue(t,0),this.east=R.defaultValue(n,0),this.north=R.defaultValue(a,0)}w.prototype.cartesianToCartographic=function(e,t){var n=this.scaleToGeodeticSurface(e,z);if(R.defined(n)){var a=this.geodeticSurfaceNormal(n,C),r=V.subtract(e,n,S),i=Math.atan2(a.y,a.x),u=Math.asin(a.z),o=b.CesiumMath.sign(V.dot(r,e))*V.magnitude(r);return R.defined(t)?(t.longitude=i,t.latitude=u,t.height=o,t):new f(i,u,o)}},w.prototype.cartesianArrayToCartographicArray=function(e,t){var n=e.length;R.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;++a)t[a]=this.cartesianToCartographic(e[a],t[a]);return t},w.prototype.scaleToGeodeticSurface=function(e,t){return l(e,this._oneOverRadii,this._oneOverRadiiSquared,this._centerToleranceSquared,t)},w.prototype.scaleToGeocentricSurface=function(e,t){R.defined(t)||(t=new V);var n=e.x,a=e.y,r=e.z,i=this._oneOverRadiiSquared,u=1/Math.sqrt(n*n*i.x+a*a*i.y+r*r*i.z);return V.multiplyByScalar(e,u,t)},w.prototype.transformPositionToScaledSpace=function(e,t){return R.defined(t)||(t=new V),V.multiplyComponents(e,this._oneOverRadii,t)},w.prototype.transformPositionFromScaledSpace=function(e,t){return R.defined(t)||(t=new V),V.multiplyComponents(e,this._radii,t)},w.prototype.equals=function(e){return this===e||R.defined(e)&&V.equals(this._radii,e._radii)},w.prototype.toString=function(){return this._radii.toString()},w.prototype.getSurfaceNormalIntersectionWithZAxis=function(e,t,n){t=R.defaultValue(t,0);var a=this._squaredXOverSquaredZ;if(R.defined(n)||(n=new V),n.x=0,n.y=0,n.z=e.z*(1-a),!(Math.abs(n.z)>=this._radii.z-t))return n},Object.defineProperties(q.prototype,{width:{get:function(){return q.computeWidth(this)}},height:{get:function(){return q.computeHeight(this)}}}),q.packedLength=4,q.pack=function(e,t,n){return n=R.defaultValue(n,0),t[n++]=e.west,t[n++]=e.south,t[n++]=e.east,t[n]=e.north,t},q.unpack=function(e,t,n){return t=R.defaultValue(t,0),R.defined(n)||(n=new q),n.west=e[t++],n.south=e[t++],n.east=e[t++],n.north=e[t],n},q.computeWidth=function(e){var t=e.east,n=e.west;return t<n&&(t+=b.CesiumMath.TWO_PI),t-n},q.computeHeight=function(e){return e.north-e.south},q.fromDegrees=function(e,t,n,a,r){return e=b.CesiumMath.toRadians(R.defaultValue(e,0)),t=b.CesiumMath.toRadians(R.defaultValue(t,0)),n=b.CesiumMath.toRadians(R.defaultValue(n,0)),a=b.CesiumMath.toRadians(R.defaultValue(a,0)),R.defined(r)?(r.west=e,r.south=t,r.east=n,r.north=a,r):new q(e,t,n,a)},q.fromRadians=function(e,t,n,a,r){return R.defined(r)?(r.west=R.defaultValue(e,0),r.south=R.defaultValue(t,0),r.east=R.defaultValue(n,0),r.north=R.defaultValue(a,0),r):new q(e,t,n,a)},q.fromCartographicArray=function(e,t){for(var n=Number.MAX_VALUE,a=-Number.MAX_VALUE,r=Number.MAX_VALUE,i=-Number.MAX_VALUE,u=Number.MAX_VALUE,o=-Number.MAX_VALUE,d=0,s=e.length;d<s;d++){var h=e[d];n=Math.min(n,h.longitude),a=Math.max(a,h.longitude),u=Math.min(u,h.latitude),o=Math.max(o,h.latitude);var l=0<=h.longitude?h.longitude:h.longitude+b.CesiumMath.TWO_PI;r=Math.min(r,l),i=Math.max(i,l)}return i-r<a-n&&(n=r,(a=i)>b.CesiumMath.PI&&(a-=b.CesiumMath.TWO_PI),n>b.CesiumMath.PI&&(n-=b.CesiumMath.TWO_PI)),R.defined(t)?(t.west=n,t.south=u,t.east=a,t.north=o,t):new q(n,u,a,o)},q.fromCartesianArray=function(e,t,n){t=R.defaultValue(t,w.WGS84);for(var a=Number.MAX_VALUE,r=-Number.MAX_VALUE,i=Number.MAX_VALUE,u=-Number.MAX_VALUE,o=Number.MAX_VALUE,d=-Number.MAX_VALUE,s=0,h=e.length;s<h;s++){var l=t.cartesianToCartographic(e[s]);a=Math.min(a,l.longitude),r=Math.max(r,l.longitude),o=Math.min(o,l.latitude),d=Math.max(d,l.latitude);var f=0<=l.longitude?l.longitude:l.longitude+b.CesiumMath.TWO_PI;i=Math.min(i,f),u=Math.max(u,f)}return u-i<r-a&&(a=i,(r=u)>b.CesiumMath.PI&&(r-=b.CesiumMath.TWO_PI),a>b.CesiumMath.PI&&(a-=b.CesiumMath.TWO_PI)),R.defined(n)?(n.west=a,n.south=o,n.east=r,n.north=d,n):new q(a,o,r,d)},q.clone=function(e,t){if(R.defined(e))return R.defined(t)?(t.west=e.west,t.south=e.south,t.east=e.east,t.north=e.north,t):new q(e.west,e.south,e.east,e.north)},q.equalsEpsilon=function(e,t,n){return e===t||R.defined(e)&&R.defined(t)&&Math.abs(e.west-t.west)<=n&&Math.abs(e.south-t.south)<=n&&Math.abs(e.east-t.east)<=n&&Math.abs(e.north-t.north)<=n},q.prototype.clone=function(e){return q.clone(this,e)},q.prototype.equals=function(e){return q.equals(this,e)},q.equals=function(e,t){return e===t||R.defined(e)&&R.defined(t)&&e.west===t.west&&e.south===t.south&&e.east===t.east&&e.north===t.north},q.prototype.equalsEpsilon=function(e,t){return q.equalsEpsilon(this,e,t)},q.validate=function(e){},q.southwest=function(e,t){return R.defined(t)?(t.longitude=e.west,t.latitude=e.south,t.height=0,t):new f(e.west,e.south)},q.northwest=function(e,t){return R.defined(t)?(t.longitude=e.west,t.latitude=e.north,t.height=0,t):new f(e.west,e.north)},q.northeast=function(e,t){return R.defined(t)?(t.longitude=e.east,t.latitude=e.north,t.height=0,t):new f(e.east,e.north)},q.southeast=function(e,t){return R.defined(t)?(t.longitude=e.east,t.latitude=e.south,t.height=0,t):new f(e.east,e.south)},q.center=function(e,t){var n=e.east,a=e.west;n<a&&(n+=b.CesiumMath.TWO_PI);var r=b.CesiumMath.negativePiToPi(.5*(a+n)),i=.5*(e.south+e.north);return R.defined(t)?(t.longitude=r,t.latitude=i,t.height=0,t):new f(r,i)},q.intersection=function(e,t,n){var a=e.east,r=e.west,i=t.east,u=t.west;a<r&&0<i?a+=b.CesiumMath.TWO_PI:i<u&&0<a&&(i+=b.CesiumMath.TWO_PI),a<r&&u<0?u+=b.CesiumMath.TWO_PI:i<u&&r<0&&(r+=b.CesiumMath.TWO_PI);var o=b.CesiumMath.negativePiToPi(Math.max(r,u)),d=b.CesiumMath.negativePiToPi(Math.min(a,i));if(!((e.west<e.east||t.west<t.east)&&d<=o)){var s=Math.max(e.south,t.south),h=Math.min(e.north,t.north);if(!(h<=s))return R.defined(n)?(n.west=o,n.south=s,n.east=d,n.north=h,n):new q(o,s,d,h)}},q.simpleIntersection=function(e,t,n){var a=Math.max(e.west,t.west),r=Math.max(e.south,t.south),i=Math.min(e.east,t.east),u=Math.min(e.north,t.north);if(!(u<=r||i<=a))return R.defined(n)?(n.west=a,n.south=r,n.east=i,n.north=u,n):new q(a,r,i,u)},q.union=function(e,t,n){R.defined(n)||(n=new q);var a=e.east,r=e.west,i=t.east,u=t.west;a<r&&0<i?a+=b.CesiumMath.TWO_PI:i<u&&0<a&&(i+=b.CesiumMath.TWO_PI),a<r&&u<0?u+=b.CesiumMath.TWO_PI:i<u&&r<0&&(r+=b.CesiumMath.TWO_PI);var o=b.CesiumMath.convertLongitudeRange(Math.min(r,u)),d=b.CesiumMath.convertLongitudeRange(Math.max(a,i));return n.west=o,n.south=Math.min(e.south,t.south),n.east=d,n.north=Math.max(e.north,t.north),n},q.expand=function(e,t,n){return R.defined(n)||(n=new q),n.west=Math.min(e.west,t.longitude),n.south=Math.min(e.south,t.latitude),n.east=Math.max(e.east,t.longitude),n.north=Math.max(e.north,t.latitude),n},q.contains=function(e,t){var n=t.longitude,a=t.latitude,r=e.west,i=e.east;return i<r&&(i+=b.CesiumMath.TWO_PI,n<0&&(n+=b.CesiumMath.TWO_PI)),(r<n||b.CesiumMath.equalsEpsilon(n,r,b.CesiumMath.EPSILON14))&&(n<i||b.CesiumMath.equalsEpsilon(n,i,b.CesiumMath.EPSILON14))&&a>=e.south&&a<=e.north};var O=new f;function T(e,t){this.x=R.defaultValue(e,0),this.y=R.defaultValue(t,0)}q.subsample=function(e,t,n,a){t=R.defaultValue(t,w.WGS84),n=R.defaultValue(n,0),R.defined(a)||(a=[]);var r=0,i=e.north,u=e.south,o=e.east,d=e.west,s=O;s.height=n,s.longitude=d,s.latitude=i,a[r]=t.cartographicToCartesian(s,a[r]),r++,s.longitude=o,a[r]=t.cartographicToCartesian(s,a[r]),r++,s.latitude=u,a[r]=t.cartographicToCartesian(s,a[r]),r++,s.longitude=d,a[r]=t.cartographicToCartesian(s,a[r]),r++,s.latitude=i<0?i:0<u?u:0;for(var h=1;h<8;++h)s.longitude=-Math.PI+h*b.CesiumMath.PI_OVER_TWO,q.contains(e,s)&&(a[r]=t.cartographicToCartesian(s,a[r]),r++);return 0===s.latitude&&(s.longitude=d,a[r]=t.cartographicToCartesian(s,a[r]),r++,s.longitude=o,a[r]=t.cartographicToCartesian(s,a[r]),r++),a.length=r,a},q.MAX_VALUE=Object.freeze(new q(-Math.PI,-b.CesiumMath.PI_OVER_TWO,Math.PI,b.CesiumMath.PI_OVER_TWO)),T.fromElements=function(e,t,n){return R.defined(n)?(n.x=e,n.y=t,n):new T(e,t)},T.fromCartesian3=T.clone=function(e,t){if(R.defined(e))return R.defined(t)?(t.x=e.x,t.y=e.y,t):new T(e.x,e.y)},T.fromCartesian4=T.clone,T.packedLength=2,T.pack=function(e,t,n){return n=R.defaultValue(n,0),t[n++]=e.x,t[n]=e.y,t},T.unpack=function(e,t,n){return t=R.defaultValue(t,0),R.defined(n)||(n=new T),n.x=e[t++],n.y=e[t],n},T.packArray=function(e,t){var n=e.length,a=2*n;if(R.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new i.DeveloperError("If result is a typed array, it must have exactly array.length * 2 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var r=0;r<n;++r)T.pack(e[r],t,2*r);return t},T.unpackArray=function(e,t){var n=e.length;R.defined(t)?t.length=n/2:t=new Array(n/2);for(var a=0;a<n;a+=2){var r=a/2;t[r]=T.unpack(e,a,t[r])}return t},T.fromArray=T.unpack,T.maximumComponent=function(e){return Math.max(e.x,e.y)},T.minimumComponent=function(e){return Math.min(e.x,e.y)},T.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n},T.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n},T.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},T.magnitude=function(e){return Math.sqrt(T.magnitudeSquared(e))};var A=new T;T.distance=function(e,t){return T.subtract(e,t,A),T.magnitude(A)},T.distanceSquared=function(e,t){return T.subtract(e,t,A),T.magnitudeSquared(A)},T.normalize=function(e,t){var n=T.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t},T.dot=function(e,t){return e.x*t.x+e.y*t.y},T.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n},T.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n},T.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n},T.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n},T.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n},T.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n},T.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t},T.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t};var P=new T;T.lerp=function(e,t,n,a){return T.multiplyByScalar(t,n,P),a=T.multiplyByScalar(e,1-n,a),T.add(P,a,a)};var N=new T,U=new T;T.angleBetween=function(e,t){return T.normalize(e,N),T.normalize(t,U),b.CesiumMath.acosClamped(T.dot(N,U))};var L=new T;T.mostOrthogonalAxis=function(e,t){var n=T.normalize(e,L);return T.abs(n,n),t=n.x<=n.y?T.clone(T.UNIT_X,t):T.clone(T.UNIT_Y,t)},T.equals=function(e,t){return e===t||R.defined(e)&&R.defined(t)&&e.x===t.x&&e.y===t.y},T.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]},T.equalsEpsilon=function(e,t,n,a){return e===t||R.defined(e)&&R.defined(t)&&b.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&b.CesiumMath.equalsEpsilon(e.y,t.y,n,a)},T.ZERO=Object.freeze(new T(0,0)),T.UNIT_X=Object.freeze(new T(1,0)),T.UNIT_Y=Object.freeze(new T(0,1)),T.prototype.clone=function(e){return T.clone(this,e)},T.prototype.equals=function(e){return T.equals(this,e)},T.prototype.equalsEpsilon=function(e,t,n){return T.equalsEpsilon(this,e,t,n)},T.prototype.toString=function(){return"("+this.x+", "+this.y+")"},e.Cartesian2=T,e.Cartesian3=V,e.Cartographic=f,e.Ellipsoid=w,e.Rectangle=q});

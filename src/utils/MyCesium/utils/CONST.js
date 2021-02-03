// const Cesium =  require('cesium/Cesium');
import AddPolylineTrailLinkMaterialOfCesium from './effect/line/PolylineTrailLink'
const OriginalCesium =  require('../../../../static/cesium/Cesium');
const Cesium = AddPolylineTrailLinkMaterialOfCesium(OriginalCesium);
window.Cesium = Cesium;

export {Cesium}
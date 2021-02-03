import {Cesium} from '../../CONST'
import {getColorRampImge, getColorRampImge2} from '../../common'

let colorImageMap = new Map();

/**
 * 加载原始线条数据
 * @param {*} dataSource 
 * @param {*} viewer 
 * @param {*} options 
 */
const loadPolylineForEntity = (dataSource, viewer, options) => {
  if(!dataSource || !viewer) return;
  let defaultOptions = {
    show: true,
    width: 2.0,
    color: "#0000FF",
    glowPower: 0.1,
    taperPower: 1.0,
    distanceDisplayCondition: {near: 0, far: Number.MAX_VALUE}
  }; 
  options = {...defaultOptions, ...options};
  let show = options.show;
  let color = options.color;
  let width = options.width;
  let glowPower = options.glowPower;
  let taperPower = options.taperPower;
  let distanceDisplayCondition =  new Cesium.DistanceDisplayCondition(options.distanceDisplayCondition.near, options.distanceDisplayCondition.far);
 
  let material =  new Cesium.PolylineGlowMaterialProperty({
    color: Cesium.Color.fromCssColorString(color),
    glowPower: glowPower,
    taperPower: taperPower
  });

  dataSource.entities.values.forEach(entity => {
    entity.polyline.clampToGround = true;
    entity.polyline.material = material;
    entity.polyline.width = width;
    entity.polyline.distanceDisplayCondition = distanceDisplayCondition;
  });
  dataSource.show = show;

  return viewer.dataSources.add(dataSource);
};

/**
 * 加载原始线条数据
 * @param {*} dataSource 
 * @param {*} viewer 
 * @param {*} options 
 */
const loadPolylineForPrimitives = (dataSource, viewer, options) => {
  if(!dataSource || !viewer) return;
  let defaultOptions = {
    show: true,
    width: 2.0,
    color: "#0000FF",
    glowPower: 0.1,
    taperPower: 1.0,
    distanceDisplayCondition: {near: 0, far: Number.MAX_VALUE}
  }; 
  options = {...defaultOptions, ...options};
  let show = options.show;
  let color = options.color;
  let width = options.width;
  let glowPower = options.glowPower;
  let taperPower = options.taperPower;
  let lineInstances = [];
  let distanceDisplayCondition =  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute (options.distanceDisplayCondition.near, options.distanceDisplayCondition.far);
  dataSource.entities.values.forEach(entity => {
    let positions = entity.polyline.positions.getValue();
    let properties = entity.properties.getValue();

    let polyline = new Cesium.PolylineGeometry({
      positions:  positions,
      width: width
    });
    let geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    let lineInstance = new Cesium.GeometryInstance({
      geometry: geometry,
      modelMatrix: Cesium.Matrix4.IDENTITY,
      properties: properties,
      attributes: {
        distanceDisplayCondition:  distanceDisplayCondition
      },
    });
    lineInstances.push(lineInstance);
  });

  var primitive = new Cesium.Primitive({
    geometryInstances: lineInstances,
    appearance: getPolylineMeatrialAppearance(color, glowPower, taperPower),
    asynchronous: false,
    show: show
  });
  return viewer.scene.primitives.add(primitive);
};

/**
 * 加载地表线条数据
 * @param {*} dataSource 
 * @param {*} viewer 
 * @param {*} options 
 */
const loadPolylineForGroundPrimitives = (dataSource, viewer, options) => {
  if(!dataSource || !viewer) return;
  let defaultOptions = {
    show: true,
    width: 2.0,
    color: "#0000FF",
    glowPower: 0.1,
    taperPower: 1.0,
    distanceDisplayCondition: {near: 0, far: Number.MAX_VALUE}
  }; 
  options = {...defaultOptions, ...options};
  let show = options.show;
  let color = options.color;
  let width = options.width;
  let glowPower = options.glowPower;
  let taperPower = options.taperPower;
  let lineInstances = [];
  let distanceDisplayCondition =  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute (options.distanceDisplayCondition.near, options.distanceDisplayCondition.far);
  dataSource.entities.values.forEach(entity => {
    let positions = entity.polyline.positions.getValue();
    let properties = entity.properties.getValue();

    let polyline = new Cesium.GroundPolylineGeometry({
      positions:  positions,
      width: width
    });
    let lineInstance = new Cesium.GeometryInstance({
      geometry: polyline,
      modelMatrix: Cesium.Matrix4.IDENTITY,
      properties: properties,
      attributes: {
        distanceDisplayCondition:  distanceDisplayCondition
      },
    });
    lineInstances.push(lineInstance);
  });
  
  var primitive = new Cesium.GroundPolylinePrimitive({
    geometryInstances: lineInstances,
    appearance: getPolylineMeatrialAppearance(color, glowPower, taperPower),
    asynchronous: false,
    show: show
  });
  return viewer.scene.groundPrimitives.add(primitive);
};

/**
 * 多线段外观
 * @param {*} color 
 * @param {*} glowPower 
 * @param {*} taperPower 
 */
const getPolylineMeatrialAppearance = (color, glowPower, taperPower) => {
  glowPower = glowPower||0.1;
  taperPower = taperPower||1.0;
  
  if(!colorImageMap.get(color)) {
    colorImageMap.set(color, getColorRampImge2(color));
  }
  let image = colorImageMap.get(color);

  return  new Cesium.PolylineMaterialAppearance({
      material: new Cesium.Material({
          fabric: {
              type: 'animationLineShader',
              uniforms: {
                  color: Cesium.Color.fromCssColorString(color),
                  image: image,
                  glowPower: glowPower,//发光强度，以总线宽的百分比表示（小于1.0）。
                  taperPower: taperPower,//渐缩效果的强度，以总线长的百分比表示。如果为1.0或更高，则不使用锥度效果。
              },
              source: `
                  uniform vec4 color;
                  uniform float glowPower;
                  uniform float taperPower;
                  uniform sampler2D image;
                  czm_material czm_getMaterial(czm_materialInput materialInput)
                  {   
                      czm_material material = czm_getDefaultMaterial(materialInput);
                      vec2 st = materialInput.st;
  
                      float time = czm_frameNumber / 360.0;
                      vec4 colorImage = texture2D(image, fract(vec2(st.s - time, 0.5 - st.t)));
                      // if(colorImage.a < .9) {
                      //     colorImage.a = 0.0;
                      // }
                      // colorImage.a = min(colorImage.a, .5);
                      material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                      material.alpha = colorImage.a * color.a;
  
                      float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);
  
                      if (taperPower <= 0.99999) {
                          glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
                      }
  
                      vec4 fragColor;
                      fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
                      fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                      fragColor = czm_gammaCorrect(fragColor);
                     
                      // material.emission = fragColor.rgb;
                      // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                      // material.alpha = fragColor.a*colorImage.a;
                      // material.diffuse = color.rgb;
                      // material.alpha = fragColor.a;
  
                      return material;
                  }
              `
          },
      }),
  });
}

export {loadPolylineForEntity, loadPolylineForPrimitives, loadPolylineForGroundPrimitives}
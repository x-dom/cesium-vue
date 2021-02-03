
import {getColorRampImge} from '../../common'

const AddPolylineTrailLinkMaterialOfCesium = function(Cesium) {
    /**
     * 流纹纹理线
     * @param {*} color 颜色
     * @param {*} duration 持续时间 毫秒
     */
    function PolylineTrailLinkMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = (new Date()).getTime();

        //加载渐变图片
        var myHex = hexify(color.toCssColorString());
        Cesium.Material.PolylineTrailLinkImageCache[color.toRgba()] = Cesium.Material.PolylineTrailLinkImageCache[color.toRgba()]|| getColorRampImge(myHex, false);
        this._image = Cesium.Material.PolylineTrailLinkImageCache[color.toRgba()];

        /**
         * rgba转16进制
         * @param {*} color 
         */
        function hexify(color) {
            var values = color
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',');
            var a = parseFloat(values[3] || 1),
                r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
                g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            var result =  "#" +
            ("0" + r.toString(16)).slice(-2) +
            ("0" + g.toString(16)).slice(-2) +
            ("0" + b.toString(16)).slice(-2);

            return result.toLocaleUpperCase();
        }
    }
    Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: Cesium.createPropertyDescriptor('color'),
    });
    PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
        return 'PolylineTrailLink';
    }
    PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = this._image;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;
    }
    PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
        return this === other ||
            (other instanceof PolylineTrailLinkMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
    }
    Cesium.Material.PolylineTrailLinkImageCache = {4294967295: getColorRampImge("#FFFFFF", false)};
    Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
    Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
    Cesium.Material.PolylineTrailLinkSource = `
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
    
        vec4 colorImage = texture2D(image, vec2(fract(st.s - time), 0.5 - st.t));
        material.alpha = colorImage.a * color.a;
        material.diffuse = (colorImage.rgb+color.rgb)/2.0;
        
        return material;
    }`;

    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
        fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                image: Cesium.Material.PolylineTrailLinkImageCache[4294967295],
                time: 0
            },
            source: Cesium.Material.PolylineTrailLinkSource
        },
        translucent: function (material) {
            return true;
        }
    });

    return Cesium;
}

export default AddPolylineTrailLinkMaterialOfCesium
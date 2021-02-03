
//十六进制颜色值的正则表达式  
const colorHexToRgba = function (value, opacity){
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
  var sColor = value;  
  if(sColor && reg.test(sColor)){  
      if(sColor.length === 4){  
          var sColorNew = "#";  
          for(var i=1; i<4; i+=1){  
              sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
          }  
          sColor = sColorNew;  
      }  
      //处理六位的颜色值  
      var sColorChange = [];  
      for(var i=1; i<7; i+=2){  
          sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
      }  
      return "rgba(" + sColorChange.join(",") + ","+opacity+")"; 
      
  } else {  
      return sColor;    
  }
};

/**
 * 获取渐变图片 getColorRampImge("#FF0000", true)
 * @param {*} elevationRamp 
 * @param {*} color 
 * @param {*} isVertical 
 */
const getColorRampImge = function (color, isVertical, elevationRamp) {
  elevationRamp = elevationRamp || [0.0, 0.95];;
  var ramp = document.createElement('canvas');
  ramp.width = isVertical ? 1 : 100;
  ramp.height = isVertical ? 100 : 1;
  var ctx = ramp.getContext('2d');
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  var values = elevationRamp;
  // var grd = isVertical ? ctx.createLinearGradient(0, 0, 0, 100) : ctx.createLinearGradient(0, 0, 100, 0);
  var grd = isVertical ? ctx.createLinearGradient(0, 90, 0, 100) : ctx.createLinearGradient(90, 0, 100, 0);
  for (var i = 0; i < values.length; i++) {
      var value = values[i];
      grd.addColorStop(value, colorHexToRgba(color, value)); 
  }
  grd.addColorStop(1.0, "#FFF"); 

  ctx.fillStyle = grd;
  
  if (isVertical)
      ctx.fillRect(0, 0, 1, 100);
  else
      ctx.fillRect(0, 0, 100, 1);
  return ramp.toDataURL("image/png");
};

/**
 * 获取渐变图片 getColorRampImge("#FF0000", true)
 * @param {*} elevationRamp 
 * @param {*} color 
 * @param {*} isVertical 
 */
const getColorRampImge2 = function (color) {
  let elevationRamp = [0.0, 0.8];
  var ramp = document.createElement('canvas');
  ramp.width = 100;
  ramp.height = 1;
  var ctx = ramp.getContext('2d');
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  var grd = ctx.createLinearGradient(90, 0, 100, 0);
  for (var i = 0; i < elevationRamp.length; i++) {
      var value = elevationRamp[i];
      grd.addColorStop(value, colorHexToRgba(color, value)); 
  }
  grd.addColorStop(1.0, "#FFF"); 
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 100, 1);
  return ramp.toDataURL("image/png");
};

export {getColorRampImge, getColorRampImge2};
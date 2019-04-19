function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var windowWidth = 700;
  //宽度缩放比
  var windowscale = originalWidth / windowWidth
  //  缩放后的高度
  var height = originalHeight * windowscale
  //console.log('缩放后的宽: ' + imageSize.imageWidth) 
  //console.log('缩放后的高: ' + imageSize.imageHeight) 
  imageSize.height = height;
  return imageSize;
}

module.exports = {
  imageUtil: imageUtil
}











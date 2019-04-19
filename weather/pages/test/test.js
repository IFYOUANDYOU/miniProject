Page({
    data: { 
        regionData: ['全部', '全部', '全部'],
        customItem: '全部'
    }, 
    regionChange: function (e) {
        this.setData(
            'regionData', e.detail.value
        );
        console.log('picker-time changed，值为', e.detail.value)
    }

});
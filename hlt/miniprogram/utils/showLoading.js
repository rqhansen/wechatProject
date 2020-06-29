const defOptions = {
    title: '加载中...',
    mask: true,
    duration: 1000
};

function showLoading(options = defOptions) {
    wx.showLoading({
        title: (options && options.title) || '加载中...',
        duration: (options && options.duration) || 1000,
        mask: (options && options.duration) || true,
    });
}

export default showLoading;
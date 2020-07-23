
function showLoading(options = {}) {
    wx.showLoading({
        title: options.title || '加载中...',
        duration: options.duration || 1000,
        mask: options.mask || true,
    });
}

export default showLoading;
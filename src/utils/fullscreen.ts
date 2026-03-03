// 全屏API封装
const Fullscreen = {
  // 进入全屏
  enter: (element = document.documentElement) => {
    // 移动设备检测
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // iOS Safari 特殊处理
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // iOS 不支持真正的全屏API，使用替代方案
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.zIndex = '9999';
        // 隐藏地址栏（iOS Safari）
        setTimeout(() => window.scrollTo(0, 1), 100);
        return Promise.resolve();
      }
    }
    
    // 标准全屏API
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari/Chrome
      return element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE11
      return element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      return element.mozRequestFullScreen();
    }
    
    // 如果没有可用的全屏API，使用CSS模拟
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.zIndex = '9999';
    return Promise.resolve();
  },

  // 退出全屏
  exit: () => {
    // 移动设备检测
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // iOS Safari 特殊处理
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const element = document.querySelector('[data-fullscreen="true"]');
        if (element) {
          element.style.position = '';
          element.style.top = '';
          element.style.left = '';
          element.style.width = '';
          element.style.height = '';
          element.style.zIndex = '';
          element.removeAttribute('data-fullscreen');
        }
        return Promise.resolve();
      }
    }
    
    // 标准全屏API
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari/Chrome
      return document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
      return document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      return document.mozCancelFullScreen();
    }
    
    // 如果使用了CSS模拟，恢复正常
    const element = document.querySelector('[data-fullscreen="true"]');
    if (element) {
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';
      element.style.zIndex = '';
      element.removeAttribute('data-fullscreen');
    }
    return Promise.resolve();
  },

  // 检测全屏状态
  isActive: () => {
    // 检查是否有CSS模拟的全屏元素
    if (document.querySelector('[data-fullscreen="true"]')) {
      return true;
    }
    
    // 标准全屏API检测
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement || // Safari/Chrome
      document.msFullscreenElement || // IE11
      document.mozFullScreenElement // Firefox
    );
  },

  // 切换全屏状态
  toggle: (element = document.documentElement) => {
    if (Fullscreen.isActive()) {
      return Fullscreen.exit();
    } else {
      // 标记元素为全屏状态（用于CSS模拟）
      element.setAttribute('data-fullscreen', 'true');
      return Fullscreen.enter(element);
    }
  },

  // 监听全屏变化
  onChange: (callback) => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, callback);
    });
    
    // 返回移除监听器的函数
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, callback);
      });
    };
  }
};

export default Fullscreen;
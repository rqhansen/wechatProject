/**
 * 节流函数
 * @param { function } fn 要节流的函数
 * @param {number} wait 执行fn的间隔 
 */
function throttle(fn, delay) {
    let timer = null;
    let current = 0;
    let past = 0;
    let context = '';
    let args = '';
    
    function execute() {
        fn.call(context,args);
        past = current;
    }
    return function () {
        context = this;
        args = arguments;
        if (timer) { //  清除上一个的定时任务
            clearTimeout(timer);
            timer = 0;
        }

        current = +new Date();
        if (!past) { // 一开始执行一次
            execute();
        } else {
            let diff = delay - (current - past);
            if (diff < 0) {
                execute();
            } else {
                timer = setTimeout(() =>{
                    execute();
                },diff)
            }
        }
    }
}

export default throttle;
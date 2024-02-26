import {
    h
} from "snabbdom";

global.__PAGES = {}

// 编译器将wxs转换为下面的形式然后注入到html中
self.__WXSCODE = {
    'page/index': {
        'm1': function () {
            const module = { exports: {} };
            var msg = "hello wxs";
            module.exports.message = msg;
            return module.exports
        }
    }
}

// 编译器将wxml转换为下面的形式然后注入到ser中
self.__APPCODE__ = {
    'page/index': ["div", {}, [
        ['h1', { _data: { _text: 'cc1' }, bindtap: 'click' }, ''],
        ['h1', {}, [['span', { bindtap: 'click1' }, '点击调用wx.showModal']]],
        ['h1', { _data: { 
            _wxscode: () => {
                return self.__WXSCODE['page/index']['m1'].bind(null)().message 
            } } }, '']
    ]]
}


let __NOWPAGE = ''


global.Page = function (params) {
    global.__PAGES[__NOWPAGE] = {
        ...params,
        setData: (data) => {
            // 这里可以加个diff
            render(self.__APPCODE__[__NOWPAGE], {
                ...params.data,
                ...data
            }, __NOWPAGE)
        }
    }
    render(self.__APPCODE__[__NOWPAGE], params.data, __NOWPAGE)
}

global.wx = {
    showModal: function () {
        console.log('showModal')
    }
}

addEventListener("message", (event) => {
    if (event.data.type === 'js') {
        __NOWPAGE = event.data.pageName
        eval(event.data.data)
    } else if (event.data.type === 'event') {
        // 事件处理
        const pageArg = global.__PAGES[event.data.pageName]
        if (pageArg && typeof pageArg[event.data.name] === 'function') {
            pageArg[event.data.name].bind(pageArg)()
        }
    }
});


function renderChild(element, pageData, pageName) {
    let arr = []
    if (element[1].bindtap) {
        element[1].dataset = { bindtap: element[1].bindtap, pageName: pageName }
    }
    if (typeof element[2] === 'string') {
        let text = element[2]
        if (element[1]._data) {
            if (typeof element[1]._data._text === 'string') {
                if (pageData[element[1]._data._text]) {
                    text = pageData[element[1]._data._text]
                }
            } else if(typeof element[1]._data._wxscode === 'function') {
                text = element[1]._data._wxscode()
            }
        }

        arr.push(h(element[0], element[1], text))
    } else if (Array.isArray(element[2])){
        let newArr = []
        for (let index = 0; index < element[2].length; index++) {
            const ele = element[2][index];
            newArr.push(renderChild(ele, pageData, pageName)[0])
        }
        arr.push(h(element[0], element[1], newArr))
    }
    return arr
}

function render(element, pageData, key) {
    const vnode = h('div', { props: { className: key }}, renderChild(element, pageData, key)[0])
    postMessage({
        type: 'view',
        data: JSON.stringify(vnode)
    })
}

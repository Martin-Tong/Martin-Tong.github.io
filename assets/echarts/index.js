(function() {

let echartsObj = {
    _instances: [],
    get instance() {
        return this._instances
    },
    set instance(ins) {
        if (ins instanceof Array || ins instanceof NodeList) {
            ins.forEach(item => {
                item in this._instances ? null : this._instances.push(item)
            }, this)
        }else {
            if (!(ins in this._instances)) {
                this._instances.push(ins)
            }
        }
        return ins
    },
    //将echarts实例绑定到dom
    initial() {
        this._instances.forEach(item => {
            let _v = echarts.init(item)
            _v.setOption(echartsOption)
            item._ecins = _v
        })
    },
    setOption(target, options) {
        target._ecins.setOption(options)
    }
}

let mockData = Mock.mock({'key|8-16': [['@cword(3)', '@natural(0,100)', '@natural(0,100)', '@natural(0,100)']]})
let echartsOption = {
    title: {
        text: 'ECharts简单示例', //dsa
        left: 'center'
    },
    dataset : {
        source: mockData.key
    },
    grid: {
        height: 'auto',
        width: '80%',
        left: 'center'
    },
    tooltip: {},
    legend: {
        right: '2%'
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            align: 'center'
        }
    },
    yAxis: {}
}

window.addEventListener('DOMContentLoaded', function() {
    $('.source-code').each(function(item) {
        $(this).parent().next('pre').children().append(
            ",dataset: {\n   source: " + JSON.stringify(mockData.key) + "\n}"
        )
        $(this).click(function() {
            $(this).parent().next('pre').slideToggle()
        })
    })
})

window.onload = function() {
    //初始化所有echarts容器
    echartsObj.instance = document.querySelectorAll('.echarts-ex') 
    echartsObj.initial()

    //为dom绑定用到的series
    $(echartsObj.instance).attr('data-series', JSON.stringify([
        {
            name: '测试bar',
            type: 'bar',
            encode: {
                x: [0],
                y: [1],
                tooltip: [1]
            }
        },
        {
            name: '测试line',
            type: 'line',
            encode: {
                y: [2],
                tooltip: [2]
            }
        },
        {
            name: '测试pie',
            type: 'pie',

            encode: {
                y: [3],
                tooltip: [3]
            }
        }
    ]))


    let interObserver = new IntersectionObserver(function(entries, observer) {
        let target = entries[0].target
        if (entries[0].intersectionRatio >0) {
            target._ecins.setOption({
                series: JSON.parse($(target).attr('data-series'))
            })
            target._renderred = true
            observer.unobserve(target)
        }
    }, {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.0
    })

    interObserver.observe(document.querySelector('#echarts-ex-1'))
}

//加载依赖
let script = document.createElement('script')
let script2 = document.createElement('script')
let script3 = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.20.0/components/prism-core.min.js'
script2.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.20.0/plugins/autoloader/prism-autoloader.min.js'
script3.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.20.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js'
document.body.append(script, script2, script3)

})()
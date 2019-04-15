function test() {
    let arr = [3, 2, 1]
    arr.forEach(async item => {
        const res = await fetch(item)
        console.log(res)
    })
    console.log('end')
}

function fetch(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x)
        }, 500 * x)
    })
}

test()
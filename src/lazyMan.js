const queue = []; // 任务队列
let currentTick; // 当前Tick
let currentTaskPromise; // 当前task
let isDraining = false; // 是否正在清空队列
let isPending = false; // 是否正在准备清空队列微任务

function nextTick() {
    return currentTick || Promise.resolve();
}

// impl
function LazyMan(name, callback) {
    const task = (resolve) => {
        console.log(`this is ${name}`);
        if (typeof callback === 'function') {
            callback(name);
        }
        resolve();
    };
    queueTask(task);
    return LazyMan;
}

async function queueTask(task, type = 0) {
    if (type === 0) {
        queue.push(task);
    } else {
        queue.unshift(task);
    }

    if (!isDraining && !isPending) {
        isPending = true;
        currentTick = Promise.resolve().then(async () => {
            isPending = false;
            isDraining = true;
            for (let i = 0; i < queue.length; i++) {
                await (currentTaskPromise = new Promise((resolve) => {
                    queue[i](resolve);
                }));
            }
            isDraining = false;
        });
    }
}

LazyMan.eat = (name, callback) => {
    const task = (resolve) => {
        console.log(`eat ${name}`);
        if (typeof callback === 'function') {
            callback(name);
        }
        resolve();
    };
    queueTask(task);
    return LazyMan;
}

LazyMan.sleep = (duration, callback) => {
    const task = (resolve) => {
        setTimeout(() => {
            console.log(`等待${duration}s`);
            if (typeof callback === 'function') {
                callback(duration);
            }
            resolve();
        }, 3000);
    };
    queueTask(task);
    return LazyMan;
}

LazyMan.sleepFirst = (duration, callback) => {
    const task = (resolve) => {
        setTimeout(() => {
            console.log(`等待 ${duration} s...`);
            if (typeof callback === 'function') {
                callback(duration);
            }
            resolve();
        }, 3000);
    };
    queueTask(task, 1);
    return LazyMan;
}

module.exports = {
    LazyMan,
    nextTick
};
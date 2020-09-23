const queue = []; // 任务队列
let currentTask; // 当前任务
let isDraining = false; // 是否正在清空队列
let isPending = false; // 是否正在准备清空队列微任务

// impl
function LazyMan(name) {
    const task = (resolve) => {
        console.log(`this is ${name}`);
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
        Promise.resolve().then(async () => {
            isPending = false;
            isDraining = true;
            for (let i = 0; i < queue.length; i++) {
                await new Promise((resolve) => {
                    queue[i](resolve);
                });
            }
        });
    }
}

LazyMan.eat = (name) => {
    const task = (resolve) => {
        console.log(`eat ${name}`);
        resolve();
    };
    queueTask(task);
    return LazyMan;
}

LazyMan.sleep = (duration) => {
    const task = (resolve) => {
        setTimeout(() => {
            console.log(`等待${duration}s`);
            resolve();
        }, 3000);
    };
    queueTask(task);
    return LazyMan;
}

LazyMan.sleepFirst = (duration) => {
    const task = (resolve) => {
        setTimeout(() => {
            console.log(`等待 ${duration} s...`);
            resolve();
        }, 3000);
    };
    queueTask(task, 1);
    return LazyMan;
}

module.exports = {
    LazyMan
};
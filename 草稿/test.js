function printProgressBar(current, total) {
    console.show(true);
    const percentage = (current / total) * 100;
    const progress = Math.round(percentage / 2); // 每个字符代表2%的进度
    const bar = '='.repeat(progress) + ' '.repeat(50 - progress); // 进度条长度为50个字符
    console.clear() // 清除当前行
        // console.cursorTo(0); // 光标移到行首
    console.log(`Progress: [${bar}]${percentage}%`);
}

// 示例：模拟一个任务进度
const totalSteps = 150;
for (let step = 0; step <= totalSteps; step++) {
    printProgressBar(step, totalSteps);
    // 模拟任务进度，实际应用中可以是异步操作
    // 这里使用setTimeout来模拟异步操作
    sleep(5000);
}

// 当任务完成时，输出一个新行
console.log('\n');
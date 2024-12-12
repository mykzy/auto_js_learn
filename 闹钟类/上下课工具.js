// 播放音乐
function playmusic(path) {
    media.playMusic(path);
    // 让音乐播放完
    sleep(media.getMusicDuration());
}
// 输出进度条
function printProgressBar(current, total) {
    console.show(true);
    const percentage = (current / total) * 100;
    const progress = Math.round(percentage / 2); // 每个字符代表2%的进度
    const bar = '='.repeat(progress) + ' '.repeat(50 - progress); // 进度条长度为50个字符
    console.clear() // 清除当前行
        // console.cursorTo(0); // 光标移到行首
    console.log(`Progress: [${bar}]${percentage}%`);
}
const totalSteps = 100;

// 上课计时器
function class_start() {
    var storage = init_all(); //数据库链接代码
    var i = 0;
    // 上课计时器线程
    var thread = threads.start(function() {
        // 在子线程执行的定时器


        // var id = setInterval(function() {
        //     i++;
        //     log("计时器开始：" + i * 5 + "秒");
        // }, 5000);
        for (let step = 0; step <= totalSteps; step++) {
            printProgressBar(step, totalSteps);
            // 模拟任务进度，实际应用中可以是异步操作
            // 这里使用setTimeout来模拟异步操作
            sleep(15000);
        }
        console.hide();
        setTimeout(function() {
            clearInterval(id);
            thread.interrupt();
        }, 1500 * 1000);
    });
    playmusic("tool/QQ音乐@435157609@钢琴曲上课铃声@纯音乐.mp3");
    thread.join();
    playmusic("tool/QQ音乐@241842965@下课铃声卡农版@薛定谔的加菲猫.mp3");
    var number1 = storage.get("上课次数(休息倒计时)");
    var number2 = storage.get("上课次数(每天)");
    storage.put("上课次数(休息倒计时)", number1 + 1);
    storage.put("上课次数(每天)", number2 + 1);
    log("输入一个上课次数(休息倒计时)" + number1 + 1);
    log("输入一个上课次数(每天)" + number2 + 1);
}
// 下课计时器
function class_end() {
    var storage = init_all(); //数据库链接代码
    var i = 0;
    var number = storage.get("上课次数(休息倒计时)");
    log(number);
    if (number == 3) {
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        log("number为3");
        number = number - 3;
        var number4 = 900;
    } else if (number < 3 && number != 0) {
        log("number为小于三而且不等于0");
        var number4 = 300;
        callApi("lifeup://api/complete?name=休息奖励");
    } else if (number > 3) {
        var number4 = 900;
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        log("number大于3");
        number = number - 3;
    }
    // 下课计时器线程
    var thread_end = threads.start(function() {
        // 在子线程执行的定时器


        // var id_end = setInterval(function() {
        //     i++;
        //     log("计时器开始：" + i * 5 + "秒");
        // }, 5000);
        for (let step = 0; step <= totalSteps; step++) {
            printProgressBar(step, totalSteps);
            // 模拟任务进度，实际应用中可以是异步操作
            // 这里使用setTimeout来模拟异步操作
            sleep(number4 * 10);
        }

        console.hide();
        setTimeout(function() {
            clearInterval(id_end);
            thread_end.interrupt();
        }, number4 * 1000);
    });
    playmusic("tool/QQ音乐@241842965@下课铃声卡农版@薛定谔的加菲猫.mp3");
    thread_end.join();
    playmusic("tool/QQ音乐@435157609@钢琴曲上课铃声@纯音乐.mp3");
    storage.put("上课次数(休息倒计时)", number);
    log("输入一个上课次数(休息倒计时)" + number);
}

// playmusic("tool/QQ音乐@241842965@下课铃声卡农版@薛定谔的加菲猫.mp3");
function show() {
    while (true) {
        var options = ["上课", "下课", "结束"];
        var i = dialogs.select("请选择一个选项", options);
        if (i >= 0) {
            // toast("您选择的是" + i);
            toast("您选择的是" + options[i]);
            if (i == 0) {
                // 执行上课计时器
                class_start();
            } else if (i == 1) {
                //执行下课计时器
                class_end();
            } else if (i == 2) {
                break;
            }
        } else {
            toast("您取消了选择");
            break;
        }
    }
}

function init_all(options) {
    var storage = storages.create("JX_self_user_time_tracker");
    log("存储库连接成功");
    return storage;
}

function callApi(str) {
    let intent = app.intent({
        action: "VIEW",
        data: str,
        flags: ["activity_new_task"]
    });

    console.log(`Starting activity with intent: ${decodeURIComponent(intent.toUri(0))}`);
    context.startActivity(intent);
}
show();
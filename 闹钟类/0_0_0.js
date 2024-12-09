// 播放音乐
function playmusic(path) {
    media.playMusic(path);
    // 让音乐播放完
    sleep(media.getMusicDuration());
}
// 上课计时器
function class_start() {
    var storage = init_all(); //数据库链接代码
    var i = 0;
    // 上课计时器线程
    var thread = threads.start(function() {
        // 在子线程执行的定时器
        var id = setInterval(function() {
            i++;
            log("计时器开始：" + i * 5 + "秒");
        }, 5000);
        setTimeout(function() {
            clearInterval(id);
            thread.interrupt();
        }, 120 * 1000);
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
        var number4 = 90;
    } else if (number < 3 && number != 0) {
        log("number为小于三而且不等于0");
        var number4 = 80;
        callApi("lifeup://api/complete?name=休息奖励");
    } else if (number > 3) {
        var number4 = 90;
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        callApi("lifeup://api/complete?name=休息奖励");
        log("number大于3");
        number = number - 3;
    }
    // 上课计时器线程
    var thread_end = threads.start(function() {
        // 在子线程执行的定时器
        var id_end = setInterval(function() {
            i++;
            log("计时器开始：" + i * 5 + "秒");
        }, 5000);
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
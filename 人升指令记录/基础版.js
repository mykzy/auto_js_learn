// 指令执行机制
function callApi(str) {
    let intent = app.intent({
        action: "VIEW",
        data: str,
        flags: ["activity_new_task"],
    });

    console.log(
        `Starting activity with intent: ${decodeURIComponent(intent.toUri(0))}`
    );
    context.startActivity(intent);
}

/* 基本思路
    1. 通过设置输入和输出数据可以进行修改
    2. 通过设置指令集实现选择输入和输出
*/
// 一个输入函数
function input_f(input_name, input_value, storage) {
    input_value = dialogs.input("请输入参数", "0");
    log("您输入的参数是" + input_name + "其值为" + input_value);
    storage.put(input_name, input_value);
}

function selection_f() {
    var options_1 = ["查看数据", "设置数据", "执行数据", "退出"];
    var i_1 = dialogs.select("请选择一个选项", options_1);
    if (i_1 >= 0) {
        // toast("您选择的是" + i);
        toast("您选择的是" + options_1[i_1]);
        if (i_1 == 0) {
            // 查看数据
            var storage = init_all();
            var number_1 = storage.get("上课次数(休息倒计时)");
            var number_2 = storage.get("上课次数(每天)");
            log("上课次数（休息倒计时）值为:" + number_1);
            log("上课次数（每天）值为:" + number_2);
        } else if (i_1 == 1) {
            var options_2 = [
                "上课次数（休息倒计时）",
                "上课次数（每天）",
                "复习完成单词数",
                "复习正确单词数",
                "学习单词数目",
                "退出",
            ];
            var i_2 = dialogs.select("请选择一个选项", options_2);
            if (i_2 >= 0 && i_2 < 5) {
                // 即非退出的指令集合
                toast("您选择的是" + options_2[i_2]);
                input_f(options_2[i_2], )
            } else if (i_2 == 5) {

            }
        }
    }
}

function init_all(options) {
    var storage = storages.create("JX_self_user_time_tracker");
    log("存储库连接成功");
    return storage;
}

selection_f();
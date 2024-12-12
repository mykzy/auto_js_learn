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
function input_f(input_name, storage) {
    input_value = dialogs.input("请输入参数", "0");
    if (input_value >= 0) {
        log("您输入的参数是" + input_name + "其值为" + input_value);
        storage.put(input_name, input_value);
    } else {
        toastr.error("输入数据非法（小于等于0），请重新输入");
    }
}

function selection_f() {
    while (true) {
        var options_1 = ["查看数据", "设置数据", "执行指令", "退出"];
        var i_1 = dialogs.select("请选择一个选项", options_1);
        if (i_1 >= 0) {
            // toast("您选择的是" + i);
            toast("您选择的是" + options_1[i_1]);
            if (i_1 == 0) {
                // 查看数据
                var storage = init_all();
                var options_2 = [
                    "上课次数(休息倒计时)",
                    "上课次数(每天)",
                    "复习完成单词数",
                    "复习正确单词数",
                    "学习单词数目",
                ];
                for (var i = 0; i < options_2.length; i++) {
                    var number_1 = storage.get(options_2[i]);
                    log(options_2[i] + "值为:" + number_1);
                }
            } else if (i_1 == 1) {
                //设置数据
                var storage = init_all();
                var options_2 = [
                    "上课次数(休息倒计时)",
                    "上课次数(每天)",
                    "复习完成单词数",
                    "复习正确单词数",
                    "学习单词数目",
                    "退出",
                ];
                var i_2 = dialogs.select("请选择一个选项", options_2);
                if (i_2 >= 0 && i_2 < 5) {
                    // 即非退出的指令集合
                    toast("您选择的是" + options_2[i_2]);
                    input_f(options_2[i_2], storage);
                } else if (i_2 == 5) {
                    toast("退出成功");
                }
            } else if (i_1 == 2) {
                var storage = init_all();
                // 执行指令
                // 指令集
                var options_command_name = [
                    "清除上课次数(每天)",
                    "清除复习完成单词数",
                    "清除复习正确单词数",
                    "清除学习单词数",
                ];
                var options_command = [
                    "null",
                    "lifeup://api/complete?name=复习单词一组",
                    "lifeup://api/complete?name=复习正确单词",
                    "lifeup://api/complete?name=新单词一组",
                ];
                var selected_command_num = dialogs.select(
                    "请选择一个指令",
                    options_command_name
                );
                if (selected_command_num >= 0) {
                    toast("您选择的是" + options_command_name[selected_command_num]);
                    if (selected_command_num == 0) {
                        storage.put("上课次数(每天)", 0);
                    } else if (selected_command_num == 1) {
                        var get_num = storage.get("复习完成单词数");
                        while (get_num > 0) {
                            get_num = get_num - 10;
                            callApi(options_command[selected_command_num]);
                        }
                        storage.put("复习完成单词数", get_num);
                    } else if (selected_command_num == 2) {
                        var get_num = storage.get("复习正确单词数");
                        while (get_num > 200) {
                            get_num = get_num - 10;
                            callApi(options_command[selected_command_num]);
                            sleep(2000);
                            log("休息中");
                        }
                        storage.put("复习正确单词数", get_num);
                    } else if (selected_command_num == 3) {
                        var get_num = storage.get("学习单词数目");
                        while (get_num > 0) {
                            get_num = get_num - 10;
                            callApi(options_command[selected_command_num]);
                        }
                        storage.put("学习单词数目", get_num);
                    }
                }
            } else if (i_1 == 3) {
                break;
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
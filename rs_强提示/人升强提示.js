function only_one() {
  // 获取当前脚本引擎
  let myEngine = engines.myEngine();
  if (!myEngine) {
    toast("无法获取当前脚本引擎，脚本退出");
    exit();
}
  let myPath = myEngine.cwd()+ "/" + myEngine.source;
  log(myPath);

  // 获取所有正在运行的脚本引擎
  let runningEngines = engines.all();
  let myCount = 0;

  // 检查是否有相同路径和文件名的脚本正在运行
  runningEngines.forEach(function (engine) {
    let path = engine.cwd() + "/" + engine.source;
    if (path === myPath) {
      myCount++;
    }
  });

  // 如果发现多个实例，提示并退出
  if (myCount > 1) {
    toast("脚本已经在运行中，退出当前实例");
    log("脚本已经在运行中，退出当前实例");
    sleep(3000);
    exit();
  }
}

// 确保已开启无障碍服务和悬浮窗权限
auto();
// requestScreenCapture(); // 可选，如果需要截图检测控件

// 定义一个函数来调用API
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


only_one();
// 监听通知栏消息（适用于系统通知类提示）
events.observeNotification();
events.on("notification", (n) => {
  // 判断通知来自目标应用
  if (n.getPackageName() === "net.sarasarasa.lifeup") {
    // 提取通知内容并弹窗
    console.log("任务名为：" + n.getTitle());
    show(n.getTitle());
  }
});

// 定义一个函数来调用API
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

// 0 - 完成任务
// 1 - 未完成任务
// 2 - 等会再说
const selectedIndex_type = {
  Yes: 0,
  Not: 1,
  Wait: 2,
};

function select(selectedIndex, msg) {
  if (selectedIndex === selectedIndex_type.Yes) {
    // 选择「是」
    log("已完成任务");
    let url = util.format("lifeup://api/complete?name=%s&ui=true", msg);
    callApi(url);
  } else if (selectedIndex === selectedIndex_type.Not) {
    // 选择「否」
    log("未完成任务");
    let url = util.format("lifeup://api/give_up?name=%s", msg);
    callApi(url);
  } else if (selectedIndex === selectedIndex_type.Wait) {
    // 超时未处理和等我一下
    log("等我一下");
  }
}

function show(msg) {
  let selectedIndex = -1; // 默认未选择

  // 创建对话框
  let dialog = dialogs
    .build({
      title: `任务 {${msg}} 是否已完成`,
      //   items: options,
      positive: "已完成",
      negative: "未完成",
      neutral: "稍后提示",
    })
    .on("any", (action, dialog) => {
      // 选择处理
      if (action == "positive") {
        clearInterval(timer); // 用户选择后停止倒计时
        selectedIndex = selectedIndex_type.Yes;
        log("你点击了确定");
      } else if (action == "negative") {
        clearInterval(timer); // 用户选择后停止倒计时
        selectedIndex = selectedIndex_type.Not;
        log("你点击了取消");
      } else if (action == "neutral") {
        clearInterval(timer); // 用户选择后停止倒计时
        selectedIndex = selectedIndex_type.Wait;
        log("你点击了稍后提示");
      }
    })
    .on("dismiss", (dialog) => {
      // 消失处理
      clearInterval(timer); // 用户选择后停止倒计时
      select(selectedIndex, msg); //选择栏消失之后处理逻辑
    })
    .show(); // 显示对话框

  // 设置倒计时
  let countdown = timeout;
  let timer = setInterval(() => {
    countdown--;
    // log("倒计时:", countdown);
    if (countdown <= 0) {
      log("倒计时结束,未选择");
      clearInterval(timer); // 停止倒计时
      selectedIndex = selectedIndex_type.Wait; // 默认选择「否」
      dialog.dismiss(); // 关闭对话框
    }
  }, 1000);
}

const timeout = 10; // 倒计时时间（秒）

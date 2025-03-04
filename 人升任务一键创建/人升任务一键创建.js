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
  function input_f() {
    input_value = dialogs.rawInput("请输入任务名称", "0");
    
    var api="lifeup://api/add_task?todo="+input_value+"&notes=%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9&category=5&deadline=%5B%24time%7Ctoday%7C86399999%5D&pin=ture"
    callApi(api=api);

}
input_f();
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
callApi("anywhere://open?sid=1570");
const $ = id => document.getElementById(id);
let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
let triggered = new Set();

function render() {
$("alarmList").innerHTML = alarms.length ? "" : "<li class='empty-state'>No alarms set yet.</li>";

```
alarms.forEach(a => {
    const li = document.createElement("li");
    li.className = "alarm-item" + (triggered.has(a.id) ? " ringing" : "");
    li.innerHTML = `<div><b>${new Date("2000-01-01T" + a.time).toLocaleTimeString("en-US", {hour:"2-digit",minute:"2-digit",hour12:$("timeFormat").value==="12"})}</b><div>${a.label}</div><small>${triggered.has(a.id) ? "Ringing!" : a.enabled ? "Active" : "Disabled"}</small></div>`;

    const actions = document.createElement("div");
    actions.className = "alarm-actions";

    const toggle = document.createElement("button");
    toggle.textContent = a.enabled ? "Disable" : "Enable";
    toggle.onclick = () => {
        a.enabled = !a.enabled;
        triggered.delete(a.id);
        save();
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete-btn";
    del.onclick = () => {
        alarms = alarms.filter(x => x.id !== a.id);
        triggered.delete(a.id);
        save();
    };

    actions.append(toggle, del);
    li.append(actions);
    $("alarmList").append(li);
});
```

}

function save() {
localStorage.setItem("alarms", JSON.stringify(alarms));
render();
}

function update() {
const now = new Date();
$("clock").textContent = now.toLocaleTimeString("en-US", {hour12:$("timeFormat").value==="12"});
$("date").textContent = now.toDateString();
const time = now.toTimeString().slice(0, 5);

```
alarms.forEach(a => {
    if (a.enabled && a.time === time && !triggered.has(a.id)) {
        triggered.add(a.id);
        alert("Alarm: " + a.label);
    } else if (a.time !== time) triggered.delete(a.id);
});
render();
```

}

$("alarmForm").onsubmit = e => {
e.preventDefault();
const time = $("alarmTime").value;

```
if (!time) {
    $("message").textContent = "Select a valid time!";
    return;
}

alarms.push({
    id: Date.now(),
    time,
    label: $("alarmLabel").value.trim() || "Alarm",
    enabled: true
});
save();
e.target.reset();
$("message").textContent = "Alarm added!";
```

};

$("clearAlarms").onclick = () => {
if (alarms.length && confirm("Clear all alarms?")) {
alarms = [];
triggered.clear();
save();
}
};

$("timeFormat").onchange = update;
update();
setInterval(update, 1000);

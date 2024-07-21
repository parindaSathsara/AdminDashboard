
function getStopCount(stopCount) {
    var label = ""

    if (stopCount == 0) {
        label = "Direct Flight"
    }
    else if (stopCount == 1) {
        label = "1 Stop"
    }
    else if (stopCount > 1) {
        label = `${stopCount} Stops`
    }
    else {
        label = "No Stops"
    }

    return label;
}

export default getStopCount;
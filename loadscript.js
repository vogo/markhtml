function loadScript(id, url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript'
    if (id !== "") {
        script.id = id;
    }
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);

    return 0;
}
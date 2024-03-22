// style it, make it so that either song is playing or you're editing parameters
// make this a sub domain of radio swarm

var queryString = window.location.search.replaceAll("amp;", "");

var urlParamsLoad = new URLSearchParams(queryString);
console.log("Q string is: " + queryString);

var hasSongReady = false;

var urlTimeout;

var songIndex = 0;
var songTimeout = "";

var activeSong = false;

var songCode = "r90xDchufXE";
var songStartTime = 0;
var songTimeOfDay = new Date();

var blackScreenTimeout = "";
var seekTimeout = "";

console.log("url params: " + urlParamsLoad.toString());

for (const key of urlParamsLoad.keys()) {
  console.log(key);
}

function isMobile() {
  if ("maxTouchPoints" in navigator) return navigator.maxTouchPoints > 0;

  const mQ = matchMedia?.("(pointer:coarse)");
  if (mQ?.media === "(pointer:coarse)") return !!mQ.matches;

  if ("orientation" in window) return true;

  return (
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(navigator.userAgent) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(navigator.userAgent)
  );
}

var isUserMobile = isMobile();

if (
  urlParamsLoad.has("songCode") &&
  urlParamsLoad.has("songStartTime") &&
  urlParamsLoad.has("songPlayTime")
) {
  console.log("has url params");
  hasSongReady = true;
  var songLink = (document.getElementById("song_link").value =
    "https://www.youtube.com/watch?v=" + urlParamsLoad.get("songCode"));
  document.getElementById("song_time").value =
    urlParamsLoad.get("songStartTime");
  document.getElementById("time_of_day").value =
    urlParamsLoad.get("songPlayTime");

  if (urlParamsLoad.has("songDesc")) {
    document.getElementById("song_description").value =
      urlParamsLoad.get("songDesc");
  }
} else {
  console.log("L");
}

displayCurrentTime();

function exampleSong() {
  var randomNum = Math.floor(Math.random() * 3) + 1;

  var songLink = "";
  var songStartTime = 0;
  var songPlayTime = "0:00";
  var songDescription = "";

  switch (randomNum) {
    case 1:
      songLink =
        "https://www.youtube.com/watch?v=jo1ikmeLUVE&pp=ygUIZGF0ZSBAIDg%3D";
      songStartTime = "0:09";
      songPlayTime = "20:00";
      songDescription = "4batz says “I'll come and slide by 8 p.m” at 8pm";
      break;
    case 2:
      songLink = "https://www.youtube.com/watch?v=fZf-SDxwA20";
      songStartTime = "2:20";
      songPlayTime = "00:00";
      songDescription =
        "That girl from Glee will say “This is the new year” at Midnight";
      break;
    case 3:
      songLink = "https://www.youtube.com/watch?v=NdjsLHFhwy4";
      songStartTime = "0:15";
      songPlayTime = "06:00";
      songDescription =
        "Rx Papi will say “I used to wake up in my room in the morning” at 6 AM";
      break;
  }

  document.getElementById("song_link").value = songLink;
  document.getElementById("song_time").value = songStartTime;
  document.getElementById("time_of_day").value = songPlayTime;
  document.getElementById("song_description").value = songDescription;

  playSong();
}

function createLink() {
  var urlParams = new URLSearchParams();

  var songLink = document.getElementById("song_link").value;
  console.log("song link: " + songLink);
  const url = new URL(songLink);
  var songUrlParams = new URLSearchParams(url.search);
  var songCodeLink = songUrlParams.getAll("v");

  var songDesc = document.getElementById("song_description").value;

  urlParams.set("songCode", songCodeLink);
  urlParams.set("songStartTime", document.getElementById("song_time").value);
  urlParams.set("songPlayTime", document.getElementById("time_of_day").value);

  if (songDesc != "") {
    urlParams.set("songDesc", songDesc);
  }

  document.getElementById("scheduleUrl").innerHTML =
    window.location.origin +
    window.location.pathname +
    "?" +
    urlParams.toString();
}

function playSong() {
  var songLink = document.getElementById("song_link").value;
  console.log("song link: " + songLink);

  var urlWorked = false;
  var url = "";
  try {
    url = new URL(songLink);
    urlWorked = true;
  } catch (e) {
    if (e.name == "TypeError") {
      alert("Your Song URL is Invalid");
    }
  }

  if (urlWorked) {
    var songUrlParams = new URLSearchParams(url.search);
    songCode = songUrlParams.getAll("v");
    console.log("song code: " + songCode);

    var songStartTimeString = document.getElementById("song_time").value;
    if (String(songStartTimeString).includes(":")) {
      songStartTime = convertToSecs(String(songStartTimeString));
    } else {
      songStartTime = Number(songStartTimeString);
    }

    if (!songStartTimeString.includes(":"))
      songStartTimeString = songStartTimeString + "s";

    document.getElementById("displaySongTime").innerHTML = songStartTimeString;

    var songTimeOfDayString = document.getElementById("time_of_day").value;
    var date = new Date();
    let [m = 0, h = 0] = songTimeOfDayString.split(":").reverse();
    date.setHours(h, m, 1);

    songTimeOfDay = date;

    hour = h;
    minute = m;

    // Determine if it's AM or PM
    var prepand = hour >= 12 ? " PM " : " AM ";

    // Convert 24-hour format to 12-hour format
    hour = hour >= 12 ? hour - 12 : hour;

    // Check for special cases when hour is 0
    if (hour === 0 && prepand === " PM ") {
      if (minute === 0) {
        hour = 12;
        prepand = " Noon";
      } else {
        hour = 12;
        prepand = " PM";
      }
    }

    // Check for special cases when hour is 0
    if (hour === 0 && prepand === " AM ") {
      if (minute === 0) {
        hour = 12;
        prepand = " Midnight";
      } else {
        hour = 12;
        prepand = " AM";
      }
    }

    if (minute < 10) minute = minute;

    // Display the current time
    var timeString = hour + ":" + minute + " " + prepand;

    document.getElementById("displayTimeOfDay").innerHTML = timeString;

    var songDesc = document.getElementById("song_description").value;

    if (songDesc != "") {
      document.getElementById("sondDescWrap").style.display = "block";
      document.getElementById("song-description-display").innerHTML = songDesc;
    } else {
      document.getElementById("sondDescWrap").style.display = "none";
      document.getElementById("song-description-display").innerHTML = "";
    }

    console.log("time of day: " + songTimeOfDay);
    console.log("song start buffer: " + songStartTime);

    document.getElementById("editingSection").style.display = "none";
    document.getElementById("playingSection").style.display = "block";

    createLink();
    playSongs();
  }
}

function editSongSettings() {
  document.getElementById("editingSection").style.display = "block";
  document.getElementById("playingSection").style.display = "none";

  stopVideo();

  if (songTimeout != "") clearTimeout(songTimeout);
  activeSong = false;
}

function convertToSecs(strTime) {
  let [s = 0, m = 0, h = 0] = strTime.split(":").reverse();
  return +h * 3600 + +m * 60 + +s;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(Date.now() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    videoId: "r90xDchufXE",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  if (hasSongReady) {
    playSong();
  }
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {}

function stopVideo() {
  player.stopVideo();
}

function displayCurrentTime() {
  // Get the current date and time
  var today = new Date();

  // Get the current hour, minute, and second
  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();

  // if (second == 0) playSongs();

  // Determine if it's AM or PM
  var prepand = hour >= 12 ? " PM " : " AM ";

  // Convert 24-hour format to 12-hour format
  hour = hour >= 12 ? hour - 12 : hour;

  // Check for special cases when hour is 0
  if (hour === 0 && prepand === " PM ") {
    if (minute === 0 && second === 0) {
      hour = 12;
      prepand = " Noon";
    } else {
      hour = 12;
      prepand = " PM";
    }
  }

  // Check for special cases when hour is 0
  if (hour === 0 && prepand === " AM ") {
    if (minute === 0 && second === 0) {
      hour = 12;
      prepand = " Midnight";
    } else {
      hour = 12;
      prepand = " AM";
    }
  }

  if (minute < 10) minute = "0" + minute;
  if (second < 10) second = "0" + second;

  // Display the current time
  var timeString = hour + ":" + minute + ":" + second + " " + prepand;

  var time = Date.now();

  while (songTimeOfDay < Date.now()) {
    songTimeOfDay.setDate(songTimeOfDay.getDate() + 1);
  }

  var delayDisplay = Date.now() - songTimeOfDay + (songStartTime + 1) * 1000;

  if (activeSong && delayDisplay < 0) {
    delayDisplay = Math.abs(delayDisplay);

    var delayTimeDisp = new Date(delayDisplay).toISOString().slice(11, 19);

    document.getElementById("timeTillStart").innerHTML = delayTimeDisp;
    document.getElementById("currentTimeOfDay").innerHTML = timeString;
  } else {
    // var delayTimeDisp = new Date(0).toISOString().slice(11, 19);

    document.getElementById("timeTillStart").innerHTML = "0:00";
    document.getElementById("currentTimeOfDay").innerHTML = timeString;
  }

  setTimeout(displayCurrentTime, 100);
}

function playSongs() {
  if (songTimeout != "") clearTimeout(songTimeout);
  activeSong = true;

  while (songTimeOfDay < Date.now()) {
    songTimeOfDay.setDate(songTimeOfDay.getDate() + 1);
  }

  var delayPlay = Date.now() - songTimeOfDay + (songStartTime + 1) * 1000;

  console.log("song delay is: " + delayPlay);
  console.log("song code is: " + songCode);

  // player.cueVideoById(String(songCode), delay);

  player.loadVideoById({
    videoId: String(songCode),
    startSeconds: delayPlay + 5,
  });

  if (isUserMobile && delayPlay < 0) {
    if (blackScreenTimeout != "") clearTimeout(blackScreenTimeout);
    blackScreenTimeout = setTimeout(playTheSong, 5000, "AjWfY7SnMBI", 1000);
    if (seekTimeout != "") clearTimeout(seekTimeout);
    seekTimeout = setTimeout(() => player.seekTo(0), 6000);
  }

  if (delayPlay < 0) {
    songTimeout = setTimeout(playTheSong, Math.abs(delayPlay), songCode, 0);
  } else {
    songTimeout = setTimeout(playTheSong, 0, songCode, Math.abs(delayPlay));
  }

  //document.getElementById("ytVid").src = "https://www.youtube.com/embed/" + songArray[songIndex].url + "?autoplay=1&start=" + String(time - songArray[songIndex].playtime);

  //   document.getElementById("title").innerHTML = songArray[songIndex].name;
  //   document.getElementById("artist").innerHTML = songArray[songIndex].artist;
}

function playTheSong(code, delay) {
  player.loadVideoById({
    videoId: String(code),
    startSeconds: delay / 1000,
  });
}

function unactiveSong() {
  console.log("turning it off");
  activeSong = false;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function copyLink() {
  // Get the text field
  var copyText = document.getElementById("scheduleUrl").innerHTML;

  if (isValidUrl(copyText)) {
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);

    // Alert the copied text
    alert("The link has been copied!");
  }
}

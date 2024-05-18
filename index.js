////////////////////////////////
// Hi there!                  //
///////////////////////////////
// This is a YouTube downloader I made!
// It uses url queries and youtube-dl to download youtube vids!
// Here's the bookmarklet version: (Copy paste the whole line, then remove the comment at the beggining.)
// javascript: {var url=window.location.href;if(/https:\/\/(www|)\.youtube\.com\/watch\?v=[A-Za-z0-9]+/i.test(url)){var newurl=`https://youtube-downloader.explosionscratc.repl.co/download?url=${url}&format=${prompt("What format would you like to download?","mp4")||"cancel"}&quality=${prompt("What quality would you like to download? (highest, lowest, highestaudio, lowestaudio, highestvideo, lowestvideo)","highest")||"cancel"}`;newurl.includes("cancel")?alert("You canceled the download"):window.location.href=newurl}else alert("Invalid url!");}

// Or from github gist:
// https://gist.github.com/Explosion-Scratch/117c72618132b8835f497b970c939e98

// Start of the code!
// -----------------------
// Require stuff lol
const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
/*
-------------------------
NOTE
-------------------------
Thanks to @redbrain on GitHub for the ytdl-core-muxer package, which gets highest video and audio and merges them using ffmpeg!
*/
const yt_mx = require("ytdl-core-muxer");
const app = express();

// Cors
app.use(cors());

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.get("/test", (_, res) => res.sendFile(__dirname + "/test.html"))
app.get("/highres", (req, res) => {
	yt_mx(req.query.url).pipe(res)
})
// Download video
app.get("/download", (req, res) => {
  const query = {
		quality: req.query.quality || "highest",
		format: req.query.format || "mp4",
		url: req.query.url || req.query["URL"],
		download: req.query.download || "true",
	}
	console.log(query.format)
	if (query.download === "true"){
		res.header(
			"Content-Disposition",
			`attachment; filename="Video.${query.format || "mp4"}"`
		);
	} else {
		res.header(
			"Content-Disposition",
			`inline; filename="Video.${query.format || "mp4"}"`
		);
	}
	if (query.quality == "highest" && query.format === "mp4"){
		yt_mx(query.url, {
			format: query.format,
			quality: query.quality,
		}).on("progress", (_, downloaded, total) => {
			console.log(`Downloaded ${downloaded}/${total}`)
		}).pipe(res)
	} else {
		ytdl(query.url, {
			format: query.format,
			quality: query.quality,
		}).on("progress", (_, downloaded, total) => {
			console.log(`Downloaded ${downloaded}/${total}`)
		}).pipe(res);
	}
});

// Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


const video = document.querySelector("video");
const boton = document.querySelector("#tomarFoto");
const botonEmoji = document.querySelector("#agregarEmoji");
const canvas = document.querySelector("canvas");
const foto = document.querySelector("#foto");

const slider = document.querySelector("#tamanoEmoji");

const context = canvas.getContext("2d");

function randomEmoji() {
	const emojis = [
		"😀", "😁", "🤣", "😂", "😅", "😇", "😍", "🥰", "😜", "🤔", "🤢", "🥶", "🤗", "🤫", "😑", "😴", "🥵", "🤯"
	];
	return emojis[Math.floor(Math.random() * emojis.length)];
}

// cargó ml5
console.log('ml5 version:', ml5.version);
// posenet
let poseNet;
let poses = [];

function tomarFoto() {
	canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
	foto.width = video.videoWidth;
  foto.height = video.videoHeight;
  context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
	const data = canvas.toDataURL("image/png");
	foto.setAttribute("src", data);
	// console.log("tomando foto", data);
}

function dibujarEmoji(params) {
	// const context = canvas.getContext("2d")

	// redibujamos foto
	context.drawImage(foto, 0, 0);
	if (poses.length > 0 && poses[0].skeleton.length > 0) {
		console.log("detecto pose");	

		poses.forEach(function (pose) {
			// console.log(pose)
			const noseX = pose.pose.nose.x ;
			const noseY = pose.pose.nose.y;
			context.font = `${slider.value}px Arial`;
			context.textAlign = "center";
			context.textBaseline = "middle"; 
			context.fillText(randomEmoji(), noseX, noseY);
		});
	}
}

function cargoModelo(m) {
	console.log("cargo modelo");
}

navigator.mediaDevices.getUserMedia({audio: false, video: true})
	.then(function (stream) {
		video.srcObject = stream;
		console.log(video);
		video.play();
	})
	.catch(function (err) {
		console.error(err)
});

// una vez que arranco el stream
video.addEventListener("canplay", tomarFoto);

// cargamos poseNet
poseNet = ml5.poseNet(cargoModelo);

// "escuchamos" poses del PoseNet
poseNet.on("pose", function(results) {
	poses = results;
	dibujarEmoji();
	console.log("poses", poses);	
});

boton.addEventListener("click", tomarFoto);

botonEmoji.addEventListener("click", function (e) {
	if (poseNet) {
		// poseNet.singlePose(foto);
		poseNet.multiPose(foto);
  }
});

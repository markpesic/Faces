const express = require("express");
const { env } = require("process");
mongoose = require("mongoose");
bcrypt = require("bcrypt");
dotenv = require("dotenv");
(uuid = require("uuid")), (cors = require("cors"));
session = require("client-sessions");
cookieParser = require("cookie-parser");
fs = require("fs");
multer = require("multer");

const result = dotenv.config();

const app = express();
app.use(express.static(__dirname + "/uploads"));
app.use(
	session({
		cookieName: "mySession", // cookie name dictates the key name added to the request object
		secret: "blargadeeblargblarg", // should be a large unguessable string
		duration: 1 * 60 * 60 * 1000, // how long the session will stay valid in ms
		activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const DBuri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@users.19jmj.mongodb.net/users?retryWrites=true&w=majority`;

mongoose.connect(DBuri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Connesso al DataBase");
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	friends: [],
	profileImage: { type: String, required: false },
});
const userModel = mongoose.model("User", userSchema);

const postSchema = new Schema({
	email: String,
	name: String,
	surname: String,
	profileImage: String,
	text: String,
	timeStamp: Date,
	comments: Array,
	likes: Number,
});
const postModel = mongoose.model("Post", postSchema);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, uuid.v4() + "-" + fileName);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
		return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
	}
};

var upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 50,
	},
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
	console.log(req.mySession);
	console.log(req.cookies);
	next();
});

app.post("/api/users/create", upload.single("profileImg"), (req, res, next) => {
	console.log("creazione utente...");
	console.log(req.file);

	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			req.body.email
		)
	) {
		console.log("Utente non creato");
		console.log(req.body.email);
		return res.status(400).json("formato non valido");
	}
	userModel.findOne({ email: req.body.email }, async (err, docs) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (docs) {
			console.log("Utente non creato");
			return res.status(500).json("utente già esistente");
		} else {
			const url = req.protocol + "://" + req.get("host");
			const hashedpsw = await bcrypt.hash(req.body.password, 10);
			const user = new userModel({
				name: req.body.name,
				surname: req.body.surname,
				email: req.body.email,
				password: hashedpsw,
				profileImage: url + "/" + req.file.filename,
			});

			user.save(function (err, user) {
				if (err) {
					console.error(err);
					return res.status(500).json();
				}
			});

			res.status(200).json("Utente creato con successo");
			console.log("Utente creato con successo");
		}
	});
});

app.post("/api/users/log_in", (req, res) => {
	console.log("Accesso in corso...");
	userModel.findOne({ email: req.body.email }, (err, result) => {
		if (err) {
			console.log("I am overhere");
			console.error(err);
			return res.status(500).json("Something went wrong");
		}
		if (!result) {
			console.log("or here");
			return res.status(500).json("utente non trovato");
		}
		if (bcrypt.compareSync(req.body.password, result.password)) {
			console.log("I am here");
			req.mySession.idsession = result._id;
			return res.status(200).json(result);
		} else {
			return res.status(400).json("password sbagliata");
		}
	});
});

//Checks if the users is authorized
app.use((req, res, next) => {
	if (!(req.mySession && req.mySession.idsession)) {
		return res.status(401).json("utente non autorizzato");
	}
	next();
});
//TODO change the databse structure so that every user has a post array, and you can pop the last post , rather than searching it, between all of them.
app.post("/api/posts/friends_new_posts", (req, res) => {
	console.log("retriving friends post...");
	var friendsPosts = [];
	var friends = [];
	userModel.findOne({ email: req.body.email }, (err, docs) => {
		if (err) {
			console.log("I am overhere");
			console.error(err);
			return res.status(500).json("Something went wrong");
		}
		if (!docs) {
			console.log("or here");
			return res.status(500).json("utente non trovato");
		}
		if (!(req.mySession.idsession == docs._id)) return res.status(500);

		docs.friends.forEach((fr) => {
			if (fr.status === "ACCEPTED") friends.push(fr);
		});
		/* console.log(docs._id);
		console.log(req.mySession);
		console.log(docs.friends);
		console.log(friends); */
		console.log("!!!!!", friends);
		if (friends.length == 0) return res.status(200).json("No new posts");
		let i = 0;
		friends.forEach((friend) => {
			postModel.find({ email: friend.email }, (err, result) => {
				i++;
				if (err) {
					console.log("I am overhere");
					console.error(err);
					return res.status(500).json("Something went wrong");
				}

				result.forEach((post) => {
					post.name = friend.name;
					post.surname = friend.surname;
					post.profileImage = friend.profileImage;
					friendsPosts.push(post);
				});

				if (i == friends.length) {
					console.log("post: ", friendsPosts);
					return res.status(200).json(friendsPosts);
				}

				/* var mostnewPost = result[0];
					result.forEach((post) => {
						if (post.timeStamp >= mostnewPost.timeStamp)
							mostnewPost = post;
					});
					friendsPosts.push(mostnewPost); */
			});
		});
	});
});

app.post("/api/posts/create", (req, res) => {
	console.log("creazione post...");
	const post = new postModel({
		email: req.body.email,
		name: req.body.name,
		surname: req.body.surname,
		profileImage: req.body.profileImage,
		text: req.body.text,
		comments: [],
		likes: 0,
		timeStamp: Date.now(),
	});

	post.save(function (err, post) {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
	});

	res.status(200).json();
});

app.post("/api/posts/add_comment", (req, res) => {
	console.log("creazione commento...");
	console.log(req.body);
	postModel.findOne({ _id: req.body.id }, (err, doc) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!doc) return res.status(500).json("errore: post non trovato");

		const comment = {
			idComment: uuid.v4(),
			name: req.body.name,
			surname: req.body.surname,
			profileImage: req.body.profileImage,
			email: req.body.email,
			text: req.body.text,
			timestamp: Date(Date.now()),
			likes: 0,
		};

		postModel.updateOne(
			{ _id: req.body.id },
			{ $push: { comments: comment } },
			(err) => {
				if (err) {
					console.error(err);
					return res.status(500).json();
				}

				console.log("commento aggiunto");
				return res.status(200).json("commento aggiunto");
			}
		);
	});
});

app.get("/api/posts/get", (req, res) => {
	let posts = [];
	console.log("retrieving");
	postModel.find({}, function (err, docs) {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		posts = docs;
		res.status(200).json(posts);
	});
});

app.post("/api/users/create_friend_request", (req, res) => {
	var friend_request = {
		name: null,
		surname: null,
		profileImage: null,
		email: null,
		status: null,
	};
	var name = null;
	var surname = null;
	var profileImage = null;
	userModel.findOne({ email: req.body.email_request_user }, (err, docs) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!docs) return res.status(500).json("Errore: utente non trovato");
		console.log(docs);
		name = docs.name;
		surname = docs.surname;
		profileImage = docs.profileImage;
	});
	console.log("creazione richiesta amico...");
	userModel.findOne({ email: req.body.email }, (err, doc) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!doc) return res.status(500).json("Errore: utente non trovato");
		friend_request.name = name;
		friend_request.surname = surname;
		friend_request.profileImage = profileImage;
		friend_request.email = req.body.email_request_user;
		friend_request.status = "PENDING";

		doc.updateOne({ $push: { friends: friend_request } }, (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json();
			}
			console.log(doc);
			console.log("amico aggiunto");
			res.status(200).json("amico aggiunto");
			return;
		});
	});
});

app.post("/api/users/friend_request", (req, res) => {
	console.log("richieste di amicizie");
	userModel.findOne({ email: req.body.email }, (err, doc) => {
		if (err) {
			console.log(err);
			return res.status(500).json();
		}

		if (!doc) return res.status(500).json("utente non trovato");

		return res.status(200).json(doc.friends);
	});
});

app.post("/api/users/resolve_friend_request", (req, res) => {
	console.log("risoluzione di una richiesta di amicizia...");
	userModel.findOne({ email: req.body.email_end_user }, (err, doc) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!doc) return res.status(500).json("utente non trovato");

		if (req.body.status == "REFUSED") {
			doc.updateOne(
				{
					$pull: { friends: { email: req.body.email_request_user } },
				},
				(err) => {
					if (err) {
						console.error(err);
						return res.status(500).json();
					}
				}
			);
			console.log("richiesta aggiornata: REFUSED");
			return res.status(200).json("richiesta aggiornata: REFUSED");
		} else if (req.body.status == "ACCEPTED") {
			doc.updateOne(
				{ $pull: { friends: { email: req.body.email_request_user } } },
				(err) => {
					if (err) {
						console.error(err);
						return res.status(500).json();
					}
				}
			);

			doc.updateOne(
				{
					$push: {
						friends: {
							name: req.body.name_request_user,
							surname: req.body.surname_request_user,
							email: req.body.email_request_user,
							profileImage: req.body.profileImage_request_user,
							status: "ACCEPTED",
						},
					},
				},
				(err) => {
					if (err) {
						console.error(err);
						return res.status(500).json();
					}
				}
			);
		}
	});

	if (req.body.status == "ACCEPTED") {
		userModel.findOne(
			{ email: req.body.email_request_user },
			(err, doc) => {
				if (err) {
					console.error(err);
					return res.status(500).json();
				}
				if (!doc) return res.status(500).json("utente non trovato");

				doc.updateOne(
					{
						$push: {
							friends: {
								name: req.body.name_end_user,
								surname: req.body.surname_end_user,
								email: req.body.email_end_user,
								profileImage: req.body.profileImage_end_user,

								status: "ACCEPTED",
							},
						},
					},
					(err) => {
						if (err) {
							console.error(err);
							return res.status(500).json();
						}
					}
				);
			}
		);
		console.log("richiesta aggiornata: ACCEPTED");
		res.status(200).json("richiesta aggiornata: ACCEPTED");
	}
});

app.post("/api/users/find", (req, res) => {
	const regex = new RegExp(req.body.query, "i");
	userModel.find({ email: regex }, (err, docs) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		let arr = [];
		docs.forEach((user) => {
			arr.push({
				email: user.email,
				name: user.name,
				surname: user.surname,
				friends: user.friends,
				profileImage: user.profileImage,
			});
		});
		res.satus(200).json(arr);
	});
});

app.post("/api/users/get_posts", (req, res) => {
	let name;
	let surname;
	let profileImage;
	var listDocs = [];
	const obj = {
		idsource: null,
		name: null,
		surname: null,
		profileImage: null,
		text: null,
		date: null,
		comments: null,
		likes: null,
	};
	userModel.findOne({ email: req.body.email }, (err, result) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!result) return res.status(500).json("utente non trovato");
		name = result.name;
		surname = result.surname;
		profileImage = result.profileImage;
	});
	postModel.find({ email: req.body.email }, (err, docs) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		if (!docs) return res.status(500).json("utente non trovato");
		console.log(docs, docs.length);
		for (let index = 0; index < docs.length; index++) {
			listDocs.push(JSON.parse(JSON.stringify(obj)));
			listDocs[index].idsource = docs[index]._id;
			listDocs[index].name = name;
			listDocs[index].surname = surname;
			listDocs[index].profileImage = profileImage;
			listDocs[index].text = docs[index].text;
			listDocs[index].date = docs[index].timeStamp;
			listDocs[index].comments = docs[index].comments;
			listDocs[index].likes = docs[index].likes;
		}
		console.log("This is the final: ", listDocs);
		return res.status(200).json(listDocs);
	});
});

app.get("/api/users/get_all", (req, res) => {
	userModel.find({}, (err, docs) => {
		if (err) {
			console.error(err);
			return res.status(500).json();
		}
		let arr = [];
		docs.forEach((user) => {
			arr.push({
				email: user.email,
				name: user.name,
				surname: user.surname,
				friends: user.friends,
				profileImage: user.profileImage ? user.profileImage : undefined,
			});
		});

		res.status(200).json(arr);
	});
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`listening at ${port}`);
});

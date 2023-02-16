require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(path.join(__dirname, "views/partials"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("form");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query.artist);

  spotifyApi
    .searchArtists(req.query.artist)
    .then(function (data) {
      console.log(
        `Search artists by ${req.query.artist} `,
        data.body.artists.items[0]
      );
      const artists = data.body.artists.items;
      res.render("artists", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", async (req, res, next) => {
  await spotifyApi.getArtistAlbums(req.query.artistId);

  console.log(`New album : ${newAlbum}`);
});

//   app.get("/albums/:artistId", (req, res, next) => {
//     console.log(`req params : ${req.params}`);
//     spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
//       res.render("albums", { album: data.body.artistId.items });
//       console.log(data.body.artistId.items);
//     });
//   });
// });

app.listen(3000, () => console.log("http://localhost:3000"));

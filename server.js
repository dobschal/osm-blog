import express from 'express';
import cms, {readData} from "@dobschal/express-cms";
import {getLeague, getMatches, getTeams} from "./osm-client.js";
import {calculateStanding} from "./osm-service.js";

const app = express()
const port = 3009

cms(app, {
    models: {
        articles: {
            title: "text",
            date: "date",
            text: "longtext",
            image: "image"
        },
        auth: {
            refreshToken: "text",
            accessToken: "text"
        }
    }
});

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/{*splat}', async (req, res) => {
    console.log("Query:", req.query);
    const {weekNr} = await getLeague();
    const weekNumber = Number(req.query.week_nr || weekNr);
    const matches = await getMatches();
    const teams = await getTeams();
    const standing = calculateStanding(matches, weekNumber, teams);
    const articles = readData("articles");
    console.log("Articles:", articles);
    res.render("index", {
        matches, teams, standing, weekNumber, articles: articles.reverse()
    });
})

app.listen(port, () => {
    console.log(` ⚡️ OSM Blog website running on port ${port}`)
})

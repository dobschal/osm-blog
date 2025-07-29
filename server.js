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
    const {weekNr} = await getLeague();
    const weekNumber = Number(req.query.week_nr || weekNr);
    const matches = await getMatches();
    const teams = await getTeams();
    const standing = calculateStanding(matches, weekNumber, teams);
    const articles = readData("articles");
    res.render("index", {
        matches, teams, standing, weekNumber, articles: sortArticlesByDate(articles)
    });
})

app.listen(port, () => {
    console.log(` ⚡️ OSM Blog website running on port ${port}`)
})

function sortArticlesByDate(articles) {
    return articles.sort((a, b) => toDate(b.date) - toDate(a.date)).map(article => {
        const date = toDate(article.date);
        article.date = date.toLocaleDateString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        return article;
    });
}

function toDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}
